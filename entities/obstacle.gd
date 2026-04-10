extends Area2D

enum Type { TRIANGLE, SQUARE, BLUE, YELLOW }

var obstacle_type: int = Type.TRIANGLE
var velocity := Vector2(-220, 0)
var points: int = 100
var obstacle_color := Color.WHITE
var shape_size := 20.0
var tween_driven := false


func setup(type: int, pos: Vector2, vel: Vector2) -> void:
	obstacle_type = type
	position = pos
	velocity = vel
	obstacle_color = _color_for_type(type)
	points = _points_for_type(type)

	var col = get_node_or_null("CollisionShape2D")
	if col and col.shape:
		col.shape = col.shape.duplicate()
		col.shape.radius = shape_size


func _process(delta: float) -> void:
	if not tween_driven:
		position += velocity * delta
	if position.x < -60:
		GameManager.add_score(points)
		queue_free()


func _color_for_type(type: int) -> Color:
	match type:
		Type.TRIANGLE: return Color(0.85, 0.85, 0.9)
		Type.SQUARE: return Color(0.9, 0.3, 0.3)
		Type.BLUE: return Color(0.3, 0.5, 0.9)
		Type.YELLOW: return Color(0.95, 0.85, 0.2)
	return Color.WHITE


func _points_for_type(type: int) -> int:
	match type:
		Type.TRIANGLE: return 100
		Type.SQUARE: return 50
		Type.BLUE: return 250
		Type.YELLOW: return 275
	return 100


const STROKE := 2.5

func _draw() -> void:
	match obstacle_type:
		Type.TRIANGLE:
			var s = shape_size
			draw_polyline(PackedVector2Array([
				Vector2(0, -s), Vector2(s, s), Vector2(-s, s), Vector2(0, -s)
			]), obstacle_color, STROKE)
		Type.SQUARE:
			var s = shape_size
			draw_rect(Rect2(-s, -s, s * 2, s * 2), obstacle_color, false, STROKE)
		Type.BLUE:
			var s = shape_size
			draw_polyline(PackedVector2Array([
				Vector2(0, -s), Vector2(s, 0), Vector2(0, s), Vector2(-s, 0), Vector2(0, -s)
			]), obstacle_color, STROKE)
		Type.YELLOW:
			draw_arc(Vector2.ZERO, shape_size, 0, TAU, 32, obstacle_color, STROKE)
