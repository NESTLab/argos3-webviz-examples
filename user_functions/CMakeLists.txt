find_package(nlohmann_json REQUIRED)

################## Controllers ##################
add_library(footbot_foraging SHARED 
  controllers/footbot_foraging.h 
  controllers/footbot_foraging.cpp)

target_link_libraries(footbot_foraging
  argos3core_simulator
  argos3plugin_simulator_footbot
  argos3plugin_simulator_genericrobot)

################## Loop functions ##################
add_library(foraging_loop_functions MODULE 
  loop_functions/foraging_loop_functions.h
  loop_functions/foraging_loop_functions.cpp)

target_link_libraries(foraging_loop_functions
  footbot_foraging
  argos3core_simulator
  argos3plugin_simulator_dynamics2d
  argos3plugin_simulator_entities
  argos3plugin_simulator_footbot
  argos3plugin_simulator_genericrobot
  argos3plugin_simulator_media
  nlohmann_json::nlohmann_json)


################## User functions ##################

add_library(foraging_user_functions MODULE
  user_functions/foraging_user_functions.h
  user_functions/foraging_user_functions.cpp)

  target_link_libraries(foraging_user_functions
  footbot_foraging
  argos3core_simulator
  argos3plugin_simulator_dynamics2d
  argos3plugin_simulator_entities
  argos3plugin_simulator_footbot
  argos3plugin_simulator_genericrobot
  argos3plugin_simulator_media
  nlohmann_json::nlohmann_json)
