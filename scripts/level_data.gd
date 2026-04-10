class_name LevelData
extends RefCounted

var song_name: String
var artist: String
var audio_path: String
var bpm: float
var duration: float
var spawn_events: Array


func _init(
	p_song_name: String = "",
	p_artist: String = "",
	p_audio_path: String = "",
	p_bpm: float = 120.0,
	p_duration: float = 60.0,
	p_spawn_events: Array = []
) -> void:
	song_name = p_song_name
	artist = p_artist
	audio_path = p_audio_path
	bpm = p_bpm
	duration = p_duration
	spawn_events = p_spawn_events
