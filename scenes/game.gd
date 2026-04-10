extends Node2D

var level_data: LevelData
var elapsed_time: float = 0.0
var is_playing: bool = false
var beat_detector: BeatDetector
var music_bus_idx: int = -1
var bpms: float = 0.331
var jump_cooldown: float = 0.0

var streams: Dictionary = {}
var stream_config: Dictionary = {}

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

	bpms = 60.0 / level_data.bpm

	# Stream durations calibrated against the original Rose level:
	#
	#   Original Rose behavior          | Stream equivalent
	#   --------------------------------|----------------------------------
	#   Triangles in bursts of 3-8s     | bass stream: 4s, refreshed by kicks
	#   Squares for 62s straight        | mid stream: 12s, refreshed by snare
	#   Blues for ~10s in waves          | high_mid stream: 6s
	#   Yellows for ~15s at the drop    | high stream: 6s
	#
	# The long mid-stream duration means that as long as the beat keeps going
	# (snare every ~360ms), the stream never expires — matching the original's
	# 173-square continuous run. During a breakdown the stream dies after 12s,
	# then re-activates when drums return.
	stream_config = {
		"bass": {
			"type_enum": 0, "type_name": "triangle",
			"interval": bpms, "duration": 4.0, "unlock": 0.0,
		},
		"mid": {
			"type_enum": 1, "type_name": "square",
			"interval": 0.36, "duration": 12.0, "unlock": 0.0,
		},
		"high_mid": {
			"type_enum": 2, "type_name": "blue",
			"interval": 0.7, "duration": 6.0, "unlock": 0.15,
		},
		"high": {
			"type_enum": 3, "type_name": "yellow",
			"interval": bpms, "duration": 6.0, "unlock": 0.35,
		},
	}
	for band_name in stream_config:
		streams[band_name] = {"active": false, "remaining": 0.0, "cooldown": 0.0}

	GameManager.current_score = 0
	_setup_audio_bus()

	if ResourceLoader.exists(level_data.audio_path):
		var audio = load(level_data.audio_path)
		audio_player.stream = audio
		audio_player.volume_db = linear_to_db(0.14)
		audio_player.bus = "Music"
		audio_player.play()

	player_node.area_entered.connect(_on_player_hit)
	is_playing = true


func _setup_audio_bus() -> void:
	music_bus_idx = AudioServer.get_bus_index("Music")
	if music_bus_idx == -1:
		AudioServer.add_bus()
		music_bus_idx = AudioServer.bus_count - 1
		AudioServer.set_bus_name(music_bus_idx, "Music")
		AudioServer.set_bus_send(music_bus_idx, "Master")

		var analyzer := AudioEffectSpectrumAnalyzer.new()
		analyzer.buffer_length = 0.1
		analyzer.fft_size = AudioEffectSpectrumAnalyzer.FFT_SIZE_2048
		AudioServer.add_bus_effect(music_bus_idx, analyzer)

	var spectrum = AudioServer.get_bus_effect_instance(music_bus_idx, 0)
	beat_detector = BeatDetector.new(spectrum)


func _process(delta: float) -> void:
	if not is_playing:
		return

	elapsed_time += delta
	jump_cooldown = maxf(jump_cooldown - delta, 0.0)
	score_label.text = "Score: " + str(GameManager.current_score)

	var progress := 0.0
	if level_data and level_data.duration > 0:
		progress = clampf(elapsed_time / level_data.duration, 0.0, 1.0)

	_process_beats(delta, progress)
	_process_streams(delta, progress)
	_process_energy_pulse()

	if level_data and elapsed_time >= level_data.duration:
		_song_finished()


func _process_beats(delta: float, progress: float) -> void:
	if beat_detector == null:
		return

	var beats := beat_detector.detect_beats(delta)

	for band_name in beats:
		if not stream_config.has(band_name):
			continue
		var config: Dictionary = stream_config[band_name]
		if progress < config["unlock"]:
			continue

		var stream: Dictionary = streams[band_name]
		stream["active"] = true
		stream["remaining"] = config["duration"]

		# Triangle group-jump on every bass beat (except during finale spin)
		if band_name == "bass" and progress < 0.87 and jump_cooldown <= 0:
			_apply_triangle_jump()
			jump_cooldown = bpms


func _process_streams(delta: float, progress: float) -> void:
	for band_name in streams:
		var stream: Dictionary = streams[band_name]
		if not stream["active"]:
			continue

		stream["remaining"] -= delta
		if stream["remaining"] <= 0:
			stream["active"] = false
			continue

		stream["cooldown"] -= delta
		if stream["cooldown"] <= 0:
			var config: Dictionary = stream_config[band_name]

			var interval: float = config["interval"]
			# Finale: machine-gun spinning triangles (like the original's 150ms burst)
			if band_name == "bass" and progress >= 0.87:
				interval = 0.15

			_spawn_for_stream(config, progress)
			stream["cooldown"] = interval


func _spawn_for_stream(config: Dictionary, progress: float) -> void:
	var screen_size := get_viewport_rect().size
	var spawn_x := screen_size.x + 100
	var type_enum: int = config["type_enum"]
	var type_name: String = config["type_name"]

	var speed: float
	var tween_type: String

	match type_name:
		"triangle":
			speed = -220.0
			tween_type = "none"
			if progress >= 0.87:
				speed = -600.0
				tween_type = "spin"
		"square":
			speed = randf_range(-475.0, -220.0)
			tween_type = "none"
		"blue":
			speed = randf_range(-400.0, -200.0)
			tween_type = "diagonal"
		"yellow":
			speed = randf_range(-800.0, -450.0)
			tween_type = "ease_to"
		_:
			speed = -220.0
			tween_type = "none"

	if type_name == "blue":
		for band_idx in range(4):
			var band_h := screen_size.y / 4.0
			var y := band_h * band_idx + randf_range(20, band_h - 20)
			var obs := _make_obstacle(type_enum, Vector2(spawn_x, y), Vector2(speed, 0))
			_apply_tween(obs, tween_type)
	else:
		var y := randf_range(screen_size.y * 0.1, screen_size.y * 0.9)
		var obs := _make_obstacle(type_enum, Vector2(spawn_x, y), Vector2(speed, 0))
		_apply_tween(obs, tween_type)


func _apply_triangle_jump() -> void:
	for child in obstacles_node.get_children():
		if is_instance_valid(child) and child.obstacle_type == 0:
			var t := create_tween()
			t.tween_property(child, "position:x", child.position.x - 180, 0.3) \
				.set_ease(Tween.EASE_IN_OUT).set_trans(Tween.TRANS_SINE)
			t.parallel().tween_property(child, "rotation_degrees",
				child.rotation_degrees - 120, 0.3)


func _process_energy_pulse() -> void:
	if beat_detector and beat_detector.should_pulse():
		for child in obstacles_node.get_children():
			if is_instance_valid(child):
				var t := create_tween()
				t.tween_property(child, "scale", Vector2(1.15, 1.15), 0.06)
				t.tween_property(child, "scale", Vector2(1.0, 1.0), 0.06)


func _make_obstacle(type: int, pos: Vector2, vel: Vector2) -> Area2D:
	var obs: Area2D = ObstacleScene.instantiate()
	obstacles_node.add_child(obs)
	obs.setup(type, pos, vel)
	return obs


func _apply_tween(obs: Node2D, tween_type: String) -> void:
	var screen_size := get_viewport_rect().size
	match tween_type:
		"jump":
			var t := create_tween()
			t.tween_property(obs, "position:x", obs.position.x - 120, 0.25) \
				.set_ease(Tween.EASE_OUT).set_trans(Tween.TRANS_BACK)
		"spin":
			var t := create_tween().set_loops()
			t.tween_property(obs, "rotation", TAU, 0.6).as_relative()
		"diagonal":
			var target_y := randf_range(80, screen_size.y - 80)
			var t := create_tween()
			t.tween_property(obs, "position:y", target_y, 1.2) \
				.set_ease(Tween.EASE_IN_OUT).set_trans(Tween.TRANS_SINE)
		"ease_to":
			var target_y := randf_range(80, screen_size.y - 80)
			var t := create_tween()
			t.tween_property(obs, "position:y", target_y, 0.8) \
				.set_ease(Tween.EASE_OUT).set_trans(Tween.TRANS_QUAD)


func _on_player_hit(_area: Area2D) -> void:
	if is_playing:
		_game_over()


func _game_over() -> void:
	is_playing = false
	audio_player.stop()
	player_node.release_mouse()
	GameManager.song_completed = false
	GameManager.save_high_score()
	_cleanup_audio_bus()
	get_tree().change_scene_to_file("res://scenes/game_over.tscn")


func _song_finished() -> void:
	is_playing = false
	audio_player.stop()
	player_node.release_mouse()
	GameManager.song_completed = true
	GameManager.save_high_score()
	_cleanup_audio_bus()
	get_tree().change_scene_to_file("res://scenes/game_over.tscn")


func _cleanup_audio_bus() -> void:
	var idx := AudioServer.get_bus_index("Music")
	if idx > 0:
		AudioServer.remove_bus(idx)
	music_bus_idx = -1


func _unhandled_input(event: InputEvent) -> void:
	if event is InputEventKey and event.pressed and event.keycode == KEY_ESCAPE:
		is_playing = false
		audio_player.stop()
		player_node.release_mouse()
		_cleanup_audio_bus()
		get_tree().change_scene_to_file("res://scenes/level_select.tscn")
