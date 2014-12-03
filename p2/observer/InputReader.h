#ifndef INPUTREADER_H_
#define INPUTREADER_H_

#include <pthread.h>
#include <vector>
#include <string>
#include "Subject.h"
#include "Observer.h"

struct InputEventData : public ObserverData
{
  char mInput;
};

class InputReader : public Subject
{
public:
  InputReader()
  {
    pthread_mutex_init(&mMutex, NULL);
  }
  virtual ~InputReader() {}
  virtual void RegisterObserver(Observer* aObserver) ;
  virtual void UnregisterObserver(Observer* aObserver);
  virtual void NotifyObservers(ObserverData* aObserverData);

  void Start();
private:
  pthread_mutex_t mMutex;
  std::vector<Observer*> mObservers;
};

#endif /* INPUTREADER_H_ */
