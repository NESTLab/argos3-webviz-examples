add_library(footbot_diffusion 
    MODULE controllers/footbot_diffusion.h 
           controllers/footbot_diffusion.cpp)

target_link_libraries(footbot_diffusion
  argos3core_simulator
  argos3plugin_simulator_footbot
  argos3plugin_simulator_genericrobot)