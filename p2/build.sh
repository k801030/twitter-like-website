OS=`uname -s`
if test "$OS" = "Linux"; then
  LDFLAGS=-lpthread
elif test "$OS" = "Darwin"; then
  LDFLAGS=
fi 

g++ -I observer/ -I client/ -I answer/ -o MyApp observer/InputReader.cpp answer/InputObserver.cpp client/Client.cpp $LDFLAGS
