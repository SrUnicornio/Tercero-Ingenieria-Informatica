# Practica 5.1

Compiling
```bash
mkdir -p build
cd build
cmake ..
make
cd ..
```

Executing
```bash
./build/VRPT-SWTS
./build/VRPT-SWTS -h | --help
```

```
Usage:
./program OPTIONS

Options:
-s | --single <input_file> Specify the input file for the instance
-b | --batch <directory> Process all files in a directory
-h | --help Display this help message

Optional options:
-o | --output <output_file> Specify the output file for the results; e.g., output.log
-i | --info Show detailed information during processing
```

Additionally, a `generate_maps.sh` script was created that extracts the data from data/ and converts it to a visual format like PNG using gnuplot.

> [!WARNING]
> You should have gnuplot installed.