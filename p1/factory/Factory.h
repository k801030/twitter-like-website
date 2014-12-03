#ifndef FACTORY_H_
#define FACTORY_H_

#include "Widgets.h"

using namespace widget;

class WidgetsFactory
{
	public:
  		virtual ~WidgetsFactory() {}
  		virtual Window* CreateWindow() = 0;
  		virtual Button* CreateButton() = 0;
  		virtual TextField* CreateTextField() = 0;
};




#endif /* FACTORY_H_ */
