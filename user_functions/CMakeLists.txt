################## Controllers ##################
add_library(footbot_foraging SHARED 
  controllers/footbot_foraging.h 
  controllers/footbot_foraging.cpp)

target_link_libraries(footbot_foraging
  argos3core_simulator
  argos3plugin_simulator_footbot
  argos3plugin_simulator_genericrobot)

################## Loop functions ##################
# link_directories(${CMAKE_BINARY_DIR}/controllers/user_functions)
set(foraging_loop_functions_SOURCES loop_functions/foraging_loop_functions.cpp)

add_library(foraging_loop_functions MODULE ${foraging_loop_functions_SOURCES})
target_link_libraries(foraging_loop_functions
  footbot_foraging
  argos3core_simulator
  argos3plugin_simulator_dynamics2d
  argos3plugin_simulator_entities
  argos3plugin_simulator_footbot
  argos3plugin_simulator_genericrobot
  argos3plugin_simulator_media)
