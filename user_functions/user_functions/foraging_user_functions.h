#ifndef FORAGING_USER_LOOP_FUNCTIONS_H
#define FORAGING_USER_LOOP_FUNCTIONS_H

#include <argos3/core/simulator/loop_functions.h>
#include <argos3/core/simulator/simulator.h>
#include <argos3/plugins/robots/foot-bot/simulator/footbot_entity.h>
#include <argos3/plugins/simulator/visualizations/webviz/webviz_user_functions.h>
#include <user_functions/loop_functions/foraging_loop_functions.h>

#include <iostream>

using namespace argos;

class CForagingUserFunctions : public CWebvizUserFunctions {
 public:
  CForagingUserFunctions();

  virtual ~CForagingUserFunctions();

  virtual const nlohmann::json sendExtraData();

  nlohmann::json sendRobotData(CFootBotEntity &);

 private:
  CForagingLoopFunctions *m_pcForagingLoopFunctions;
};

#endif