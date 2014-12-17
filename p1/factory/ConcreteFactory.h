#ifndef CONCRETEFACTORY_H
#define CONCRETEFACTORY_H

#define override

#include "Widgets.h"

namespace widget{

	class ConcreteFactory{
		public:
  			virtual Window* CreateWindow() = 0;
  			virtual Button* CreateButton() = 0;
  			virtual TextField* CreateTextField() = 0;

  			virtual ~ConcreteFactory() {};
	};

	class WindowImplFactory : public ConcreteFactory {
		public:
			Window* CreateWindow() override;
  			Button* CreateButton() override;
  			TextField* CreateTextField() override;
	
  			~WindowImplFactory() override;
	};

}





#endif /* CONCRETEFACTORY_H_ */