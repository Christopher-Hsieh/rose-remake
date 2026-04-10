extends Control

var prompt_tween: Tween


func _ready() -> void:
	Input.mouse_mode = Input.MOUSE_MODE_VISIBLE
	_pulse_prompt()


func _pulse_prompt() -> void:
	var prompt = $CenterContainer/VBoxContainer/Subtitle
	prompt_tween = create_tween().set_loops()
	prompt_tween.tween_property(prompt, "modulate:a", 0.3, 1.0).set_trans(Tween.TRANS_SINE)
	prompt_tween.tween_property(prompt, "modulate:a", 1.0, 1.0).set_trans(Tween.TRANS_SINE)


func _input(event: InputEvent) -> void:
	var proceed := false
	if event is InputEventMouseButton and event.pressed:
		proceed = true
	if event is InputEventScreenTouch and event.pressed:
		proceed = true
	if event is InputEventKey and event.pressed:
		proceed = true
	if proceed:
		get_tree().change_scene_to_file("res://scenes/level_select.tscn")
