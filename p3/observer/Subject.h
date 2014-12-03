#ifndef SUBJECT_H_
#define SUBJECT_H_

class Observer;
class ObserverData;

class Subject
{
public:
  ~Subject() {}
  virtual void RegisterObserver(Observer* aObserver) = 0;
  virtual void UnregisterObserver(Observer* aObserver) = 0;
  virtual void NotifyObservers(ObserverData* aObserverData) = 0;
};

#endif /* SUBJECT_H_ */
