#!/bin/bash
launch_test(){
  npx element run the-list-ca-basic-user-worklflow-flood.perf.ts
}
# For loop 5 times
for i in {1..100}   
do
	launch_test $i & 
done

wait 
echo "All done"   