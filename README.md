This is a project for my Electroacoustic Compotition class, using MaxMSP and Javascript. 

Name: Modern Improvisation on an Ancient Idea

Notes:
Source code located at: https://github.com/misingnoglic/improviser/

The idea of this patch was inspired by the Passamezzo Antico, an ancient chord progression (i VII i V i VII i V i) that was consistently used and improvised over in Early Music. Common examples of this chord progression include Greensleeves and Recercada Primera, but musicians would just gather and improvise their own melodies over these chords together, as the Brandeis Early Music Ensemble did in their Spring 2014 concert. 

I was inspired by the idea of improvising over this bass line, and decided to create a program to do it for me. The main chunk of the code is in the random.js file, which keeps track of the previous note and decides what's the best new note to jump to, based on that previous note and the current chord it's on. If the new note is on the same chord as the previous note, the program generates all the other notes on that chord that it could possibly go to, and it chooses to either stay on the current note or to jump to a new note on that chord (with some intervals weighted differently than others). The program also tries to stay in the same direction, meaning if the notes were previously going higher in pitch, the new note is also more likely to go higher in pitch, and vice versa. The program also constrains the melody to certain octaves. 

If the new note is on a new chord, the program gets the notes of the new chord and picks one to jump to. I programmed the file to pick the note that is closest to the old note on the new chord, to allow for very smooth voice leading. For example, if the last note was an F# on a D chord, when the progression moves to the G chord, the program is more likely to play a G, since it is only 1 step away from an F#. This pattern is then repeated until the user stops the program, allowing an infinite amount of music to be generated.

The outputted sounds are created with square and saw waves, to create a Gameboy type aesthetic, which I felt was a nice touch to this ancient sound. 

I started just improvising over the Passamezzo Antico chords, but decided I could refactor the code to allow for different progressions to be added as well, with the same rules. I added a few generic progressions, as well as more from Early Music (e.g. La Folia), as well as a few from modern video games (Skyrim and Legend of Zelda). 

I hope to continue working on this project and add logic for non chord tones, as well as implementing a way to stop the music cleanly. There's a lot I can do with this idea, and I've had lots of fun working on it this semester. 

Screenshots coming soon
