#include <node.h>

using namespace v8;

void Prime(const FunctionCallbackInfo<Value>&args){
	Isolate* isolate = args.GetIsolate();

	Local<Array> primeArray = Array::New(isolate);

	int n = args[0].As<Number>()->Value();
	int c = 0;
	for(int i=2; i<=n; i++){
		bool isPrime = true;
		for(int j=2; j*j<=i; j++){
			if(i%j == 0){
				isPrime = false;
				break;
			}
		}
		if(isPrime == true){
			primeArray->Set(c, Number::New(isolate, i));
			c++;
		}
	}
	args.GetReturnValue().Set(primeArray);

}

void Initialize(Local<Object> exports){
	NODE_SET_METHOD(exports, "prime", Prime);
}

NODE_MODULE(addon, Initialize);