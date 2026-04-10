class_name BeatDetector
extends RefCounted

var spectrum: AudioEffectSpectrumAnalyzerInstance

const HISTORY_SIZE := 30

var bands: Array = []
var overall_energy: float = 0.0
var overall_history: Array = []
var pulse_cooldown: float = 0.0


func _init(spectrum_instance: AudioEffectSpectrumAnalyzerInstance) -> void:
	spectrum = spectrum_instance
	# Thresholds tuned against the Rose track so that:
	#   bass  -> detects every kick drum hit reliably (drives triangles)
	#   mid   -> detects the steady beat/snare (drives squares, must be very sensitive
	#            so the stream stays alive through sustained sections)
	#   high_mid -> detects claps and mid-synths (drives blues)
	#   high  -> detects hi-hats, cymbals, shimmery synths (drives yellows)
	#
	# Lower threshold = more sensitive. During a steady beat the rolling average
	# is already high, so each individual hit is only ~15-25% above average.
	bands = [
		_make_band("bass", 40.0, 200.0, 1.18, 0.12),
		_make_band("mid", 200.0, 1500.0, 1.12, 0.10),
		_make_band("high_mid", 1500.0, 5000.0, 1.25, 0.15),
		_make_band("high", 5000.0, 16000.0, 1.35, 0.20),
	]


func _make_band(p_name: String, min_freq: float, max_freq: float, threshold: float, cd: float) -> Dictionary:
	return {
		"name": p_name,
		"min_freq": min_freq,
		"max_freq": max_freq,
		"threshold": threshold,
		"cooldown_time": cd,
		"cooldown": 0.0,
		"history": [] as Array,
	}


func detect_beats(delta: float) -> Array:
	if spectrum == null:
		return []

	var triggered: Array = []
	overall_energy = 0.0

	for band in bands:
		var mag: Vector2 = spectrum.get_magnitude_for_frequency_range(
			band["min_freq"], band["max_freq"]
		)
		var energy: float = mag.length()
		overall_energy += energy

		band["cooldown"] -= delta

		var history: Array = band["history"]
		history.append(energy)
		if history.size() > HISTORY_SIZE:
			history.pop_front()

		if history.size() < 3 or band["cooldown"] > 0:
			continue

		var avg := 0.0
		for e in history:
			avg += e
		avg /= history.size()

		if energy > avg * band["threshold"] and energy > 0.00003:
			triggered.append(band["name"])
			band["cooldown"] = band["cooldown_time"]

	overall_history.append(overall_energy)
	if overall_history.size() > HISTORY_SIZE:
		overall_history.pop_front()
	pulse_cooldown -= delta

	return triggered


func should_pulse() -> bool:
	if pulse_cooldown > 0 or overall_history.size() < 5:
		return false

	var avg := 0.0
	for e in overall_history:
		avg += e
	avg /= overall_history.size()

	if overall_energy > avg * 1.2 and overall_energy > 0.00008:
		pulse_cooldown = 0.06
		return true
	return false
