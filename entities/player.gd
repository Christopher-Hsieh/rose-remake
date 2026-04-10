extends Area2D

const MOVE_SPEED := 260.0
const PLAYER_RADIUS := 20.0

var screen_size: Vector2
var player_color := Color.WHITE
var is_mouse_captured := false


func _ready() -> void:
	screen_size = get_viewport_rect().size
	_randomize_color()


func _process(delta: float) -> void:
	screen_size = get_viewport_rect().size

	var velocity := Vector2.ZERO
	if Input.is_key_pressed(KEY_W) or Input.is_key_pressed(KEY_UP):
		velocity.y -= 1
	if Input.is_key_pressed(KEY_S) or Input.is_key_pressed(KEY_DOWN):
		velocity.y += 1
	if Input.is_key_pressed(KEY_A) or Input.is_key_pressed(KEY_LEFT):
		velocity.x -= 1
	if Input.is_key_pressed(KEY_D) or Input.is_key_pressed(KEY_RIGHT):
		velocity.x += 1

	if velocity.length() > 0:
		velocity = velocity.normalized() * MOVE_SPEED
		position += velocity * delta

	_clamp_position()


func _input(event: InputEvent) -> void:
	if event is InputEventMouseButton and event.pressed:
		if Input.mouse_mode != Input.MOUSE_MODE_CAPTURED:
			Input.mouse_mode = Input.MOUSE_MODE_CAPTURED
			is_mouse_captured = true
		_randomize_color()

	if event is InputEventMouseMotion and is_mouse_captured:
		position += event.relative
		_clamp_position()

	if not is_mouse_captured:
		if event is InputEventScreenDrag:
			position = event.position
			_clamp_position()
		if event is InputEventScreenTouch and event.pressed:
			position = event.position
			_clamp_position()
			_randomize_color()


func _clamp_position() -> void:
	position = position.clamp(
		Vector2(PLAYER_RADIUS, PLAYER_RADIUS),
		screen_size - Vector2(PLAYER_RADIUS, PLAYER_RADIUS)
	)


func _randomize_color() -> void:
	player_color = Color.from_hsv(randf(), 0.8, 1.0)
	modulate = player_color
	var particles = get_node_or_null("CPUParticles2D")
	if particles:
		particles.color = player_color


func release_mouse() -> void:
	Input.mouse_mode = Input.MOUSE_MODE_VISIBLE
	is_mouse_captured = false


func _exit_tree() -> void:
	release_mouse()


func _draw() -> void:
	draw_arc(Vector2.ZERO, PLAYER_RADIUS, 0, TAU, 32, Color.WHITE, 2.5)
