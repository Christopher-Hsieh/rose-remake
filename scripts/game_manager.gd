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
	# BPM 181 → ~331.5 ms per beat
	var bpms := 60.0 / 181.0

	# Every event is timed to match the original Phaser3 game exactly.
	# Types: triangle, triangle_jump, triangle_spin, square, blue, yellow, pulse
	return LevelData.new("Rose", "cornandbeans", "res://assets/audio/rose.ogg", 181.0, 75.5, [
		# --- Intro: triangles + jump tweens ---
		{"time": 0.05, "type": "triangle", "count": 11, "interval": 0.6,
			"speed_min": -220.0, "speed_max": -220.0},
		{"time": 0.17, "type": "triangle_jump", "count": 12, "interval": 0.62},

		# --- Squares: steady stream for the rest of the song ---
		{"time": 4.0, "type": "square", "count": 173, "interval": 0.36,
			"speed_min": -475.0, "speed_max": -220.0},

		# --- BPM pulse visual starts at ~6.8s ---
		{"time": 6.8, "type": "pulse"},

		# --- 18.4s: beat-synced triangles + jumps ---
		{"time": 18.4, "type": "triangle", "count": 24, "interval": bpms,
			"speed_min": -220.0, "speed_max": -220.0},
		{"time": 18.4, "type": "triangle_jump", "count": 27, "interval": bpms},

		# --- 28s: blue clap section (4-at-a-time) ---
		{"time": 28.0, "type": "blue", "count": 15, "interval": 0.7,
			"speed_min": -400.0, "speed_max": -200.0},

		# --- 38.5s: brief triangle burst ---
		{"time": 38.5, "type": "triangle", "count": 13, "interval": bpms,
			"speed_min": -220.0, "speed_max": -220.0},
		{"time": 38.5, "type": "triangle_jump", "count": 19, "interval": bpms},

		# --- 45.8s: yellow drop ---
		{"time": 45.8, "type": "yellow", "count": 46, "interval": bpms,
			"speed_min": -800.0, "speed_max": -450.0},

		# --- 49.5s: post-drop triangles ---
		{"time": 49.5, "type": "triangle", "count": 13, "interval": bpms,
			"speed_min": -220.0, "speed_max": -220.0},
		{"time": 49.5, "type": "triangle_jump", "count": 21, "interval": bpms},

		# --- 66s: finale — fast spinning triangles ---
		{"time": 66.0, "type": "triangle_spin", "count": 41, "interval": 0.15,
			"speed_min": -600.0, "speed_max": -600.0},
	])


func _create_miku_level() -> LevelData:
	var bpms := 60.0 / 170.0
	return LevelData.new("Miku", "Anamanaguchi", "res://assets/audio/miku.ogg", 170.0, 219.0, [
		{"time": 1.0, "type": "triangle", "count": 15, "interval": 0.7,
			"speed_min": -200.0, "speed_max": -200.0},
		{"time": 1.0, "type": "triangle_jump", "count": 15, "interval": 0.72},
		{"time": 12.0, "type": "square", "count": 500, "interval": 0.36,
			"speed_min": -475.0, "speed_max": -220.0},
		{"time": 14.0, "type": "pulse"},
		{"time": 30.0, "type": "triangle", "count": 30, "interval": bpms,
			"speed_min": -220.0, "speed_max": -220.0},
		{"time": 30.0, "type": "triangle_jump", "count": 30, "interval": bpms},
		{"time": 55.0, "type": "blue", "count": 20, "interval": 0.7,
			"speed_min": -400.0, "speed_max": -200.0},
		{"time": 75.0, "type": "triangle", "count": 25, "interval": bpms,
			"speed_min": -220.0, "speed_max": -220.0},
		{"time": 75.0, "type": "triangle_jump", "count": 25, "interval": bpms},
		{"time": 100.0, "type": "yellow", "count": 50, "interval": bpms,
			"speed_min": -800.0, "speed_max": -450.0},
		{"time": 120.0, "type": "blue", "count": 20, "interval": 0.7,
			"speed_min": -400.0, "speed_max": -200.0},
		{"time": 140.0, "type": "triangle", "count": 30, "interval": bpms,
			"speed_min": -220.0, "speed_max": -220.0},
		{"time": 140.0, "type": "triangle_jump", "count": 30, "interval": bpms},
		{"time": 160.0, "type": "yellow", "count": 50, "interval": bpms,
			"speed_min": -800.0, "speed_max": -450.0},
		{"time": 190.0, "type": "triangle_spin", "count": 60, "interval": 0.15,
			"speed_min": -600.0, "speed_max": -600.0},
	])
