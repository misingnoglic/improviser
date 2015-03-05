inlets = 1;
outlets = 1;
current = 0;
modes = [0,0,0,0,1,1,1,1,0,0,0,0,2,2,2,2]
current = -1
function get_mode(){
	current += 1
	outlet(0, 0)
}