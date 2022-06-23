#!/bin/bash
launch_test(){
  npx element run the-list-ca-basic-user-worklflow-flood.perf.ts
}

for i in {1..50}   
do
	launch_test $i & 
done

wait 
echo "All done"   