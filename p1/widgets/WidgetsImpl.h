#ifndef WIDGETS_IMPL_H
#define WIDGETS_IMPL_H

#include "Widgets.h"

using namespace std;

namespace widget {
	namespace window {
		class WindowImpl : public Window {
		public:
			virtual ~WindowImpl() {}
			virtual string GetTitle();
			virtual Dimension GetDimension();
		};

		class ButtonImpl : public Button {
		public:
			virtual ~ButtonImpl() {}
			virtual string GetLabel();
			virtual Dimension GetDimension();
		};

		class TextFieldImpl : public TextField {
			virtual ~TextFieldImpl() {}
			virtual string GetText();
			virtual Dimension GetDimension();
		};
	}


} // namespace widget

#endif

