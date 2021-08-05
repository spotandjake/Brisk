if [ ! -d "./dist" ]
then
  mkdir "dist"
else 
  rm ./dist/*
fi
for filename in *.wat; do
  [ -e "$filename" ] || continue
  # ... rest of the loop body
  outName=`echo $filename | sed "s/.wat$/.wasm/"`
  exec wat2wasm "$filename" -o "./dist/$outName"
done