#include <iostream>
#include "Observer.h"
#include "InputReader.h"

void
InputReader::RegisterObserver(Observer* aObserver)
{
  pthread_mutex_lock(&mMutex);
  mObservers.push_back(aObserver);
  pthread_mutex_unlock(&mMutex);
}

void
InputReader::UnregisterObserver(Observer* aObserver)
{
  pthread_mutex_lock(&mMutex);
  for (std::vector<Observer*>::iterator iter = mObservers.begin();
       iter != mObservers.end();
       iter++) {
    if (*iter == aObserver) {
      mObservers.erase(iter);
    }
  }
  pthread_mutex_unlock(&mMutex);
}

void
InputReader::NotifyObservers(ObserverData* aData)
{
  pthread_mutex_lock(&mMutex);
  for (std::vector<Observer*>::iterator iter = mObservers.begin();
       iter != mObservers.end();
       iter++) {
    (*iter)->Observe(aData);
  }
  pthread_mutex_unlock(&mMutex);
}

void
InputReader::Start()
{
  char c = '\0';
  while (true) {
    std::cin >> c;
    InputEventData data;
    data.mInput = c;
    NotifyObservers(&data);
  }
}
