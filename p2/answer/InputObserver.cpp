#include <iostream>
#include "InputObserver.h"
#include "InputReader.h"

using namespace std;

void InputObserver::Observe(ObserverData* data){
	cout << ((InputEventData *) data) -> mInput << "\n";
}


