#include "mailprovider.hpp"

using namespace eosio;
using std::string;

void mailprovider::send(
  name from,
  string to_email,
  string msg
) {
  auto self = get_self();
  require_auth(from);
  name api = get_api();
  check(is_account(api), "Api account does not exist");

  letter_index letters(self, get_first_receiver().value);

  letters.emplace(self, [&](auto &row) {
    row.key = letters.available_primary_key();
    row.from = from;
    row.to_email = to_email;
    row.msg = msg;
    row.date = now();
  });

  action(
    permission_level{self, "active"_n},
    self,
    "process"_n,
    std::make_tuple(api, from, to_email, msg)
  ).send();
}

void mailprovider::init(name api) {
  auto self = get_self();
  require_auth(self);
  config_index configs(self, get_first_receiver().value);

  auto itr = configs.find(self.value);
  if (itr == configs.end()) {
    configs.emplace(self, [&](auto &row) {
      row.key = self;
      row.api = api;
    });
  } else {
    configs.modify(itr, self, [&](auto &row) {
      row.key = self;
      row.api = api;
    });
  }
}