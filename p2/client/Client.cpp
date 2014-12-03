#include "InputReader.h"
#include "InputObserver.h"
#include "Observer.h"

static void*
InputReaderThread(void* aInputReader)
{
  InputReader* reader = static_cast<InputReader*>(aInputReader);
  reader->Start();
  return NULL;
}

int main(int argc, char** argv)
{
  pthread_t thread;

  InputReader* reader = new InputReader();

  // TODO implement your InputObserver
  InputObserver* observer = new InputObserver();
  reader->RegisterObserver(observer);

  pthread_create(&thread, NULL, InputReaderThread, reader);

  void* unused = NULL;
  pthread_join(thread, &unused);

  delete observer;
  delete reader;

}
