//#include "Factory.h"
#include <iostream>

// TODO Implement the concrete factory in this file.
#include "ConcreteFactory.h"
#include "Widgets.h"

using namespace widget ;

//using namespace widget::window;

// TODO Don't include WidgetsImpl.h
// #include "WidgetsImpl.h"

int
main(int argc, char** argv)
{
  // TODO Don't depend on WindowImpl.
  ConcreteFactory *factory = new WindowImplFactory();
  //Window *window = factory-> new WindowImpl();
  Window *window = factory->CreateWindow();
  Dimension dim = window->GetDimension();
  std::cout << "Window titled '" << window->GetTitle() << "' is created. Dimensions: "
      << dim.Width << " x " << dim.Height
      << "\n";

  // TODO Don't depend on TextFieldImpl.
  //TextField* textField = new TextFieldImpl();
  TextField *textField = factory->CreateTextField();
  dim = textField->GetDimension();
  std::cout << "TextField with '" << textField->GetText() << "' is created. Dimensions: "
      << dim.Width << " x " << dim.Height
      << "\n";

  // TODO Don't depend on ButtonImpl.
  //Button* button = new ButtonImpl();
  Button *button = factory->CreateButton();
  dim = button->GetDimension();
  std::cout << "Button labeled '" << button->GetLabel() << "' is created. Dimensions: "
      << dim.Width << " x " << dim.Height
      << "\n";

  delete button;
  delete textField;
  delete window;

  return 0;
}
