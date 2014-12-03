#include "InputReaderAdapter.h"

void InputReaderAdapterImpl::BeginRead(){
	mImpl -> Start();
}

void InputReaderAdapterImpl::AddInputObserver(Observer* aObserver){
	mImpl -> RegisterObserver(aObserver);
}