inlets = 1;
outlets = 4;

Gm_triad = triad(7,false) //notes of Gm chord
Gm_scale = scale(7,true,true)
F_triad = triad(5,true) //notes of F chord
F_scale = scale(5,true)
D_triad = triad(2,true) // notes of D chord
special = pentatonic(0,true)

bass_notes = [55,53,50,0] //bass notes (not implemented)

last_note = 76
displacement = 0
last_movement = 0
last_mode = null
modes = [Gm_triad,F_triad,D_triad,special]

//below is dictionary of MIDI number to note name
notes = {0:"C", 1:"C#", 2:"D", 3:"D#", 4:"E", 5:"F", 6:"F#", 7:"G", 9:"A", 10:"Bb", 11:"B"}

min_octave = 4
max_octave = 7

function random_choice(items,weights){
	random_num = random_float(0,list_sum(weights))
	position = 0
	for (i=0; i<items.length; i++){
		position += weights[i]

		if (random_num < position){ //if the number is that movement
			return items[i] //make that the note shift
		}
	}
}

function change_mode(new_mode){
	offset = 0
	num = new_mode
	last_pitch = last_note%12 //gets the previous pitch we used
	last_octave = Math.floor(last_note/12) //previous octave we were in
	new_mode = modes[new_mode]
	distances = []
	for (i=0; i<new_mode.length; i++){
		distances.push( last_pitch - new_mode[i] )
	}
	distances.sort(function(a,b){ return Math.abs(a) - Math.abs(b) })
	reversed_temp = distances
	reversed = []
	for (i=0; i<reversed_temp.length; i++){
		reversed.push(Math.abs(reversed_temp[i]))
	}
	new_note = random_choice(distances,reversed)
	
	new_note = new_note + 12*octave_shift + offset
	
	last_note = new_note
	last_movement = note_shift
	last_mode = num
	
	outlet(1,new_note);
	outlet(0,notes[new_note%12])
	outlet(2,toHz(new_note))
	outlet(3,toHz(bass[num]))
	post("\n")
	post(bass_notes[num])
}

function get_note(mode) {
	offset = 0
	post(mode)
	post(offset)
	//offset = 0
	//modes = [Gm_triad,F_triad,D_triad,special]
	num = mode
	mode = modes[mode]//selects the mode we are in
	sorted_mode = []
	for (i=0; i<mode.length; i++){
		sorted_mode.push(mode[i]%12)
	}
	sorted_mode.sort //puts the mode in sorted value (for octave reasons)
	
	
	last_pitch = last_note%12 //gets the previous pitch we used
	last_octave = Math.floor(last_note/12) //previous octave we were in
	
	index = sorted_mode.indexOf(last_pitch); //where the last pitch is in the mode
	
	note_shift = 0 //how much we will move the pitch
	octave_shift = 0 //how much we will move the octave
	movements = [0,1,2,3,4] //possibly movements (positive or negative)
	movement_probabilities = [5,5,1,2,1] //probability of hitting each note (weighted, so 5 is 5x more likely than 1)
	
	
	position=0 //current movement we could be at
	random_num = random_float(0,list_sum(movement_probabilities)) //random number placed between one of these movements
	
	post("random num: ")
	post(random_num)
	for (i=0; i<movements.length; i++){
		position += movement_probabilities[i]

		if (random_num < position){ //if the number is that movement
			note_shift = movements[i] //make that the note shift
			break
		}
	}
	d = .3*sign(last_movement) // -.3 or +.3
	s = Math.random() //random number between 0 and 1

	if (s>.5+d){ //if that random number is greater than .5+d, it will go in the negative direction
		//this is so when there is a downward trend, it is more likely that it will go down than up, and vice versa
		note_shift = note_shift*-1
	}
	post("amount moving: ")
	post(note_shift)
	
	//the new note is the old index plus however many the note shifted, wrapped around (and positive)
	new_note = sorted_mode[Math.abs((index+note_shift)%mode.length)]
	 
	post ("new pitch: ")
	post(new_note)
	
	//the octave shift is the old octave shift, plus however much the shift made it go up or down
	octave_shift = last_octave + Math.floor((index+note_shift)/mode.length)
	
	if (octave_shift<min_octave){
		octave_shift = last_octave+1
		note_shift = -1*(last_movement) + 3
		post("too low!")
	}
	else if (octave_shift>max_octave){
		post("Too high!")
		octave_shift = last_octave-1
		note_shift = -1*(last_movement) - 3
	}
	
	new_note = new_note + 12*octave_shift + offset
	
	last_note = new_note
	last_movement = note_shift
	last_mode = num
	
	
/*	note = mode[random(0,3)]; //chooses a random note from the mode
	midi_value = note+(12*random(min_octave,max_octave+1))
	
	outlet(1,midi_value); // puts in outlet 1 that note from 4-8 octaves above
	outlet(0,notes[note%12]); //puts the name of that note in outlet 0
	outlet(2,toHz(midi_value)) */
	
	outlet(1,new_note);
	outlet(0,notes[new_note%12])
	outlet(2,toHz(new_note))
	outlet(3,toHz(bass[num]))
	post("\n")
	post(bass_notes[num])
}

function random(min,maximum){
	//simple function that returns a number within the min/max bounds
	return Math.floor(Math.random()*(maximum-min)+min);
}

function random_float(min,maximum){
	return Math.random()*(maximum-min)+min
}

function toHz(midi){
	return Math.pow(2,(midi-69)/12)*440
}

function triad(midi, major){
	add = 0
	if (major){
		add=1
	}
	return [midi,midi+3+add,midi+7]
}


function scale(midi, major, harmonic){
	add=0 
	seventh=0
	if (major){
		add = 1
	}
	else{
		if (harmonic){
			seventh=1
		}
	}
	L = [midi,midi+2, midi+3+add, midi+5, midi+7, midi+8+add, midi+10+add+seventh, midi+12]
	return L
}

function pentatonic(midi,major){
	add = 0
	if (major){
		add=1
	}
	return [midi, midi+2, midi+3+add, midi+7, midi+8+add, midi+12]
}

function sign(n){
	if (n<0){
		return -1
	}
	else if (n>0){
		return 1
	}
	else{
		return 0
	}
}

function list_sum(L){
	sum=0
	for (i=0; i<L.length; i++){
		sum+=L[i]
	}
	return sum
}

function ms_to_bpm(seconds){
	return 1/((n/1000)/60)
}