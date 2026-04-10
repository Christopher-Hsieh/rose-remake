extends Node

var current_level_data: LevelData
var current_score: int = 0
var song_completed: bool = false
var high_scores: Dictionary = {}
var levels: Array = []


func _ready() -> void:
	_init_levels()


func _init_levels() -> void:
	levels.append(_create_rose_level())
	levels.append(_create_miku_level())


func set_level(level_data: LevelData) -> void:
	current_level_data = level_data
	current_score = 0
	song_completed = false


func add_score(points: int) -> void:
	current_score += points


func save_high_score() -> void:
	if current_level_data == null:
		return
	var key = current_level_data.song_name
	if not high_scores.has(key) or current_score > high_scores[key]:
		high_scores[key] = current_score


func get_high_score(song_name: String) -> int:
	return high_scores.get(song_name, 0)


func _create_rose_level() -> LevelData:
	return LevelData.new("Rose", "cornandbeans", "res://assets/audio/rose.ogg", 181.0, 75.5)


func _create_miku_level() -> LevelData:
	return LevelData.new("Miku", "Anamanaguchi", "res://assets/audio/miku.ogg", 170.0, 219.0)
