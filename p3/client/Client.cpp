#include "InputReader.h"
#include "InputObserver.h"
#include "Observer.h"

#include "InputReaderAdapter.h"

static void*
InputReaderThread(void* aInputReader)
{
  InputReaderAdapter* adapter = static_cast<InputReaderAdapter*>(aInputReader);
  adapter->BeginRead();
  return NULL;
}

int main(int argc, char** argv)
{
  pthread_t thread;

  // Note that InputReaderAdapter is the interface, and InputReaderAdapterImpl
  // is the implementation.
  InputReaderAdapter* adapter = new InputReaderAdapterImpl(new InputReader());

  InputObserver* observer = new InputObserver();
  adapter->AddInputObserver(observer);

  pthread_create(&thread, NULL, InputReaderThread, adapter);

  void* unused = NULL;
  pthread_join(thread, &unused);

  delete observer;
  delete adapter;

}
