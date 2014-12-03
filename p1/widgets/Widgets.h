#ifndef WIDGETS_H
#define WIDGETS_H

#include <string>

using namespace std;

namespace widget {

struct Dimension {
  unsigned int Width;
  unsigned int Height;
  Dimension(unsigned int aWidth, unsigned int aHeight)
    : Width(aWidth)
    , Height(aHeight)
  { }
};

class Widget {
public:
  virtual ~Widget() {}
  virtual Dimension GetDimension() = 0;
};

class Window : public Widget {
public:
  virtual ~Window() {}
  virtual string GetTitle() = 0;
};

class Button : public Widget {
public:
  virtual ~Button() {}
  virtual string GetLabel() = 0;
};

class TextField : public Widget {
public:
  virtual ~TextField() {}
  virtual string GetText() = 0;
};

} // namespace widget

#endif
