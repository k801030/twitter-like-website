#ifndef OBSERVER_H_
#define OBSERVER_H_

struct ObserverData
{
};

class Observer
{
public:
  virtual void Observe(ObserverData* data) = 0;
  virtual ~Observer() {}
};

#endif /* OBSERVER_H_ */
