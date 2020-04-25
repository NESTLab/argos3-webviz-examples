#include "foraging_user_functions.h"

/****************************************/
/****************************************/

CForagingUserFunctions::CForagingUserFunctions() {
  m_pcForagingLoopFunctions = static_cast<CForagingLoopFunctions *>(
    &CSimulator::GetInstance().GetLoopFunctions());
}

/****************************************/
/****************************************/

CForagingUserFunctions::~CForagingUserFunctions() {}

/****************************************/
/****************************************/

const nlohmann::json CForagingUserFunctions::sendExtraData() {
  return m_pcForagingLoopFunctions->GetStatus();
}

/****************************************/
/****************************************/

REGISTER_WEBVIZ_USER_FUNCTIONS(
  CForagingUserFunctions, "foraging_user_functions")
