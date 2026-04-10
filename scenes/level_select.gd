extends Control


func _ready() -> void:
	Input.mouse_mode = Input.MOUSE_MODE_VISIBLE

	var rose_btn: Button = $CenterContainer/VBoxContainer/HBoxContainer/RoseButton
	var miku_btn: Button = $CenterContainer/VBoxContainer/HBoxContainer/MikuButton

	_style_card(rose_btn, "Rose", "cornandbeans", "1:15")
	_style_card(miku_btn, "Miku", "Anamanaguchi", "3:39")

	rose_btn.pressed.connect(_on_rose_selected)
	miku_btn.pressed.connect(_on_miku_selected)


func _style_card(button: Button, title: String, artist: String, duration: String) -> void:
	button.text = title + "\n" + artist + "\n" + duration

	var normal := StyleBoxFlat.new()
	normal.bg_color = Color(0.15, 0.16, 0.2)
	normal.border_color = Color(0.3, 0.32, 0.4)
	normal.set_border_width_all(2)
	normal.set_corner_radius_all(8)
	normal.content_margin_left = 40
	normal.content_margin_right = 40
	normal.content_margin_top = 30
	normal.content_margin_bottom = 30
	button.add_theme_stylebox_override("normal", normal)

	var hover := normal.duplicate() as StyleBoxFlat
	hover.bg_color = Color(0.2, 0.22, 0.28)
	hover.border_color = Color(0.5, 0.52, 0.6)
	button.add_theme_stylebox_override("hover", hover)

	var pressed_style := normal.duplicate() as StyleBoxFlat
	pressed_style.bg_color = Color(0.25, 0.27, 0.35)
	button.add_theme_stylebox_override("pressed", pressed_style)

	var focus := normal.duplicate() as StyleBoxFlat
	focus.border_color = Color(0.5, 0.52, 0.6)
	button.add_theme_stylebox_override("focus", focus)

	button.add_theme_color_override("font_color", Color(0.85, 0.85, 0.9))
	button.add_theme_color_override("font_hover_color", Color(1.0, 1.0, 1.0))
	button.add_theme_font_size_override("font_size", 28)


func _on_rose_selected() -> void:
	GameManager.set_level(GameManager.levels[0])
	get_tree().change_scene_to_file("res://scenes/game.tscn")


func _on_miku_selected() -> void:
	GameManager.set_level(GameManager.levels[1])
	get_tree().change_scene_to_file("res://scenes/game.tscn")


func _input(event: InputEvent) -> void:
	if event is InputEventKey and event.pressed and event.keycode == KEY_ESCAPE:
		get_tree().change_scene_to_file("res://scenes/title_screen.tscn")
