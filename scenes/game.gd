extends Node2D

var level_data: LevelData
var elapsed_time: float = 0.0
var is_playing: bool = false
var spawn_event_index: int = 0
var active_spawners: Array = []
var bpm_timer: float = 0.0
var pulse_active: bool = false

@onready var audio_player: AudioStreamPlayer = $AudioStreamPlayer
@onready var score_label: Label = $HUD/ScoreLabel
@onready var player_node: Area2D = $Player
@onready var obstacles_node: Node2D = $Obstacles

const ObstacleScene = preload("res://entities/obstacle.tscn")


func _ready() -> void:
	level_data = GameManager.current_level_data
	if level_data == null:
		if GameManager.levels.size() > 0:
			level_data = GameManager.levels[0]
			GameManager.current_level_data = level_data
		else:
			push_error("No level data available")
			return

	GameManager.current_score = 0

	if ResourceLoader.exists(level_data.audio_path):
		var audio = load(level_data.audio_path)
		audio_player.stream = audio
		audio_player.volume_db = linear_to_db(0.14)
		audio_player.play()

	player_node.area_entered.connect(_on_player_hit)
	is_playing = true


func _process(delta: float) -> void:
	if not is_playing:
		return

	elapsed_time += delta
	score_label.text = "Score: " + str(GameManager.current_score)

	_process_spawn_events()
	_process_active_spawners(delta)
	if pulse_active:
		_process_bpm_pulse(delta)

	if level_data and elapsed_time >= level_data.duration:
		_song_finished()


# --- Spawn event scheduling ---

func _process_spawn_events() -> void:
	if level_data == null:
		return
	while spawn_event_index < level_data.spawn_events.size():
		var ev: Dictionary = level_data.spawn_events[spawn_event_index]
		if elapsed_time >= ev["time"]:
			_start_spawner(ev)
			spawn_event_index += 1
		else:
			break


func _start_spawner(event: Dictionary) -> void:
	var etype: String = event.get("type", "triangle")

	if etype == "pulse":
		pulse_active = true
		return

	active_spawners.append({
		"type": etype,
		"remaining": event.get("count", 1),
		"interval": event.get("interval", 0.5),
		"cooldown": 0.0,
		"speed_min": event.get("speed_min", -220.0),
		"speed_max": event.get("speed_max", event.get("speed_min", -220.0)),
	})


func _process_active_spawners(delta: float) -> void:
	var finished: Array = []
	for i in range(active_spawners.size()):
		var s: Dictionary = active_spawners[i]
		s["cooldown"] -= delta
		while s["cooldown"] <= 0 and s["remaining"] > 0:
			_do_spawn(s)
			s["remaining"] -= 1
			s["cooldown"] += s["interval"]
		if s["remaining"] <= 0:
			finished.append(i)

	for i in range(finished.size() - 1, -1, -1):
		active_spawners.remove_at(finished[i])


# --- Spawning by type ---

func _do_spawn(spawner: Dictionary) -> void:
	var screen_size := get_viewport_rect().size

	match spawner["type"]:
		"triangle":
			_spawn_triangle(spawner, screen_size)
		"triangle_spin":
			_spawn_spinning_triangle(spawner, screen_size)
		"triangle_jump":
			_apply_triangle_jump()
		"square":
			_spawn_square(spawner, screen_size)
		"blue":
			_spawn_blue(spawner, screen_size)
		"yellow":
			_spawn_yellow(spawner, screen_size)


func _spawn_triangle(spawner: Dictionary, screen_size: Vector2) -> void:
	var spawn_x := screen_size.x + 100
	var y := randf_range(screen_size.y * 0.1, screen_size.y * 0.9)
	_make_obstacle(0, Vector2(spawn_x, y), Vector2(-220, 0))


func _spawn_spinning_triangle(spawner: Dictionary, screen_size: Vector2) -> void:
	var spawn_x := screen_size.x + 100
	var y := randf_range(screen_size.y * 0.1, screen_size.y * 0.9)
	var obs := _make_obstacle(0, Vector2(spawn_x, y), Vector2(-600, 0))
	var t := create_tween()
	t.tween_property(obs, "rotation_degrees", obs.rotation_degrees - 1440, 2.5)


func _apply_triangle_jump() -> void:
	for child in obstacles_node.get_children():
		if is_instance_valid(child) and child.obstacle_type == 0:
			var t := create_tween()
			t.tween_property(child, "position:x", child.position.x - 180, 0.3) \
				.set_ease(Tween.EASE_IN_OUT).set_trans(Tween.TRANS_SINE)
			t.parallel().tween_property(child, "rotation_degrees",
				child.rotation_degrees - 120, 0.3)


func _spawn_square(spawner: Dictionary, screen_size: Vector2) -> void:
	var spawn_x := screen_size.x + 100
	var y := randf_range(0, screen_size.y)
	var speed := randf_range(spawner["speed_min"], spawner["speed_max"])
	var obs := _make_obstacle(1, Vector2(spawn_x, y), Vector2(speed, 0))
	obs.rotation_degrees = randf_range(-26, 26)


func _spawn_blue(spawner: Dictionary, screen_size: Vector2) -> void:
	var spawn_x := screen_size.x + 100
	var speed := randf_range(spawner["speed_min"], spawner["speed_max"])
	var blues: Array = []

	for band in range(4):
		var band_h := screen_size.y / 4.0
		var y := band_h * band + randf_range(0, band_h)
		var obs := _make_obstacle(2, Vector2(spawn_x, y), Vector2.ZERO)
		obs.tween_driven = true
		obs.rotation_degrees = randf_range(-26, 26)
		blues.append(obs)

	for obs in blues:
		var target_y: float = clampf(obs.position.y + randf_range(-300.0, 300.0), 20, screen_size.y - 20)
		var t := create_tween()
		t.tween_property(obs, "position:x", -100.0, 2.5) \
			.set_ease(Tween.EASE_IN).set_trans(Tween.TRANS_QUAD)
		t.parallel().tween_property(obs, "position:y", target_y, 2.5) \
			.set_ease(Tween.EASE_IN).set_trans(Tween.TRANS_QUAD)


func _spawn_yellow(spawner: Dictionary, screen_size: Vector2) -> void:
	var spawn_x := screen_size.x + 100
	var y := randf_range(20, screen_size.y * 14.0 / 15.0)
	var obs := _make_obstacle(3, Vector2(spawn_x, y), Vector2.ZERO)
	obs.tween_driven = true
	obs.rotation_degrees = randf_range(-10, 10)

	var target_y := randf_range(20, screen_size.y * 14.0 / 15.0)
	var dur := randf_range(1.4, 2.25)
	var t := create_tween()
	t.tween_property(obs, "position:x", -150.0, dur) \
		.set_ease(Tween.EASE_IN).set_trans(Tween.TRANS_QUAD)
	t.parallel().tween_property(obs, "position:y", target_y, dur) \
		.set_ease(Tween.EASE_IN).set_trans(Tween.TRANS_QUAD)


# --- BPM pulse visual ---

func _process_bpm_pulse(delta: float) -> void:
	if level_data == null or level_data.bpm <= 0:
		return
	var beat_interval := 60.0 / level_data.bpm
	bpm_timer += delta
	if bpm_timer >= beat_interval:
		bpm_timer -= beat_interval
		for child in obstacles_node.get_children():
			if is_instance_valid(child) and child.obstacle_type != 0:
				var t := create_tween()
				t.tween_property(child, "scale", Vector2(1.2, 1.2), 0.04) \
					.set_ease(Tween.EASE_IN_OUT).set_trans(Tween.TRANS_SINE)
				t.tween_property(child, "scale", Vector2(1.0, 1.0), 0.04) \
					.set_ease(Tween.EASE_IN_OUT).set_trans(Tween.TRANS_SINE)


# --- Obstacle factory ---

func _make_obstacle(type: int, pos: Vector2, vel: Vector2) -> Area2D:
	var obs: Area2D = ObstacleScene.instantiate()
	obstacles_node.add_child(obs)
	obs.setup(type, pos, vel)
	return obs


# --- Game state ---

func _on_player_hit(_area: Area2D) -> void:
	if is_playing:
		_game_over()


func _game_over() -> void:
	is_playing = false
	audio_player.stop()
	player_node.release_mouse()
	GameManager.song_completed = false
	GameManager.save_high_score()
	get_tree().change_scene_to_file("res://scenes/game_over.tscn")


func _song_finished() -> void:
	is_playing = false
	audio_player.stop()
	player_node.release_mouse()
	GameManager.song_completed = true
	GameManager.save_high_score()
	get_tree().change_scene_to_file("res://scenes/game_over.tscn")


func _unhandled_input(event: InputEvent) -> void:
	if event is InputEventKey and event.pressed and event.keycode == KEY_ESCAPE:
		is_playing = false
		audio_player.stop()
		player_node.release_mouse()
		get_tree().change_scene_to_file("res://scenes/level_select.tscn")
