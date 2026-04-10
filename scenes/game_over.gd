extends Control

@onready var status_label: Label = $CenterContainer/VBoxContainer/StatusLabel
@onready var score_label: Label = $CenterContainer/VBoxContainer/ScoreLabel
@onready var high_score_label: Label = $CenterContainer/VBoxContainer/HighScoreLabel
@onready var retry_button: Button = $CenterContainer/VBoxContainer/RetryButton
@onready var menu_button: Button = $CenterContainer/VBoxContainer/MenuButton


func _ready() -> void:
	Input.mouse_mode = Input.MOUSE_MODE_VISIBLE

	if GameManager.song_completed:
		status_label.text = "Song Complete!"
	else:
		status_label.text = "Game Over"

	score_label.text = "Score: " + str(GameManager.current_score)

	if GameManager.current_level_data:
		var hs := GameManager.get_high_score(GameManager.current_level_data.song_name)
		high_score_label.text = "Best: " + str(hs)
	else:
		high_score_label.text = ""

	retry_button.pressed.connect(_on_retry)
	menu_button.pressed.connect(_on_menu)
	_style_buttons()


func _style_buttons() -> void:
	for btn: Button in [retry_button, menu_button]:
		var normal := StyleBoxFlat.new()
		normal.bg_color = Color(0.15, 0.16, 0.2)
		normal.border_color = Color(0.3, 0.32, 0.4)
		normal.set_border_width_all(2)
		normal.set_corner_radius_all(6)
		normal.content_margin_left = 30
		normal.content_margin_right = 30
		normal.content_margin_top = 12
		normal.content_margin_bottom = 12
		btn.add_theme_stylebox_override("normal", normal)

		var hover := normal.duplicate() as StyleBoxFlat
		hover.bg_color = Color(0.2, 0.22, 0.28)
		hover.border_color = Color(0.5, 0.52, 0.6)
		btn.add_theme_stylebox_override("hover", hover)

		var pressed_style := normal.duplicate() as StyleBoxFlat
		pressed_style.bg_color = Color(0.25, 0.27, 0.35)
		btn.add_theme_stylebox_override("pressed", pressed_style)

		var focus := normal.duplicate() as StyleBoxFlat
		focus.border_color = Color(0.5, 0.52, 0.6)
		btn.add_theme_stylebox_override("focus", focus)

		btn.add_theme_color_override("font_color", Color(0.85, 0.85, 0.9))
		btn.add_theme_color_override("font_hover_color", Color(1.0, 1.0, 1.0))
		btn.add_theme_font_size_override("font_size", 24)


func _on_retry() -> void:
	get_tree().change_scene_to_file("res://scenes/game.tscn")


func _on_menu() -> void:
	get_tree().change_scene_to_file("res://scenes/level_select.tscn")


func _input(event: InputEvent) -> void:
	if event is InputEventKey and event.pressed and event.keycode == KEY_R:
		_on_retry()
