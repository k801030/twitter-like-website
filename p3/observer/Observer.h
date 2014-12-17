#ifndef OBSERVER_H_
#define OBSERVER_H_

struct ObserverData
{
};

class Observer
{
public:
  virtual ~Observer() {}
  virtual void Observe(ObserverData* data) = 0;
};

#endif /* OBSERVER_H_ */
