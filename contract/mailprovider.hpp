#include <eosio/eosio.hpp>
#include <eosio/system.hpp>

using namespace eosio;
using std::string;

class [[eosio::contract("mailprovider")]] mailprovider : public eosio::contract {
public:
  using contract::contract;

  mailprovider(name receiver, name code, datastream<const char *> ds) : contract(receiver, code, ds) {}

  [[eosio::action]]
  void send(name from, string to_email, string msg);

  [[eosio::action]]
  void init(name api);

  [[eosio::action]]
  void process(name api, name from, string to_email, string msg) {
    require_auth(get_self());
    require_recipient(api);
  }

private:
  // Config (store api account, etc)
  struct [[eosio::table]] config {
    name key;
    name api;

    uint64_t primary_key() const { return key.value; }
  };

  typedef multi_index<"config"_n, config> config_index;

  // Letters to send
  struct [[eosio::table]] letter {
    uint64_t key;
    name from;
    string to_email;
    string msg;
    uint64_t date;

    uint64_t primary_key() const { return key; }

    uint64_t get_secondary_1() const { return date; }
  };

  typedef multi_index<"letters"_n, letter, indexed_by<"bydate"_n,
    const_mem_fun < letter, uint64_t, &letter::get_secondary_1>>>
  letter_index;

  name get_api() {
    auto self = get_self();
    config_index configs(self, get_first_receiver().value);
    auto itr = configs.find(self.value);
    check(itr != configs.end(), "Config doesn't exists");

    return itr->api;
  }

  uint64_t now() {
    return current_time_point().sec_since_epoch();
  }
};