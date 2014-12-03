#include "ConcreteFactory.h"
#include "WidgetsImpl.h"

using namespace widget::window;

namespace widget{

	Window* WindowImplFactory::CreateWindow(){
		return new WindowImpl();
	} 

	Button* WindowImplFactory::CreateButton(){
		return new ButtonImpl();
	}

	TextField* WindowImplFactory::CreateTextField(){
		return new TextFieldImpl();
	}

	WindowImplFactory::~WindowImplFactory(){}

};