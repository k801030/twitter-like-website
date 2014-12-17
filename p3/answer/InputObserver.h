#ifndef INPUTOBSERVER_H_
#define INPUTOBSERVER_H_

#include "Observer.h"

class InputObserver : public Observer{
	public:
  		virtual void Observe(ObserverData* data);
  		virtual ~InputObserver() {}
};

#endif /* INPUTOBSERVER_H_ */