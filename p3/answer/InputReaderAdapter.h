#include "InputReader.h"
#include "Observer.h"


class InputReaderAdapter{
	public:
		virtual void BeginRead() = 0;
		virtual void AddInputObserver(Observer* aObserver) = 0;

		virtual ~InputReaderAdapter(){}
};

class InputReaderAdapterImpl : public InputReaderAdapter{
	public:
		InputReaderAdapterImpl(InputReader* aInputReader){
			mImpl = aInputReader;
		}
		~InputReaderAdapterImpl(){}
		void BeginRead();
		void AddInputObserver(Observer* aObserver);
		
	private:
		InputReader* mImpl;
};
