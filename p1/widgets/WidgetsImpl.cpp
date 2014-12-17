#include <WidgetsImpl.h>

using namespace std;

namespace widget {
	namespace window {
		Dimension
		WindowImpl::GetDimension()
		{
  // Return a 640x480 window.
			return Dimension(640, 480);
		}

		string
		WindowImpl::GetTitle()
		{
			return std::string("Window Title");
		}

		Dimension
		ButtonImpl::GetDimension()
		{
  // Return a 32x16 button.
			return Dimension (32, 16);
		}

		string
		ButtonImpl::GetLabel()
		{
			return std::string("Push me");
		}

		Dimension
		TextFieldImpl::GetDimension()
		{
  // Return a 100x20 text field.
			return Dimension (100, 20);
		}

		string
		TextFieldImpl::GetText()
		{
			return std::string("A long long sentence.");
		}

	}



}
