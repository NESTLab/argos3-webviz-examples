# argos3-webviz-examples
Examples for ARGoS3 Webviz plugin

To compile we assume you have

- Cmake
- Argos3
- Lua (for Argos3)
- Argos3-webviz

To build, run the following commands
```console
$ mkdir build
$ cd build
$ cmake ..
$ make
$ cd ..
```


## Examples
Every example has two parts, a Serverside with argos and webviz, and a client side which can be anything from python client to javascript web application.

> Few of the examples here are taken from [argos3-examples](https://github.com/ilpincy/argos3-examples) with added Webviz as the visualizer.

**PLEASE NOTE:** Make sure that port 3000 is not being used by any other process or existing argos3 webviz experiment, or you need to change experiment file and client accordingly.
### DIFFUSION

In this example experiment, a foot-bot performs obstacle avoidance
while navigating in an small square environment.

To Run, run argos in one terminal
```console
$ argos3 -c diffusion/diffusion_1.argos
```

and run a static webserver to host html files in another terminal
```console
$ python3 -m http.server --directory ./common 8000
```

Now you can open http://localhost:8000/ in any `modern` browser.

Here we use the example webclient provided by "argos3-webviz".


### Basic html form

In this example experiment, an experiment is shown to be controlled
using a html form.

The experiment is empty (no robots) we only see and control the `State`
of the experiment.

To Run, run argos in one terminal
```console
$ argos3 -c basic_html_form/empty_experiment.argos
```

and run a static webserver to host html files in another terminal
```console
$ python3 -m http.server --directory ./basic_html_form/client 8000
```

Now you can open http://localhost:8000/ in any `modern` browser.
