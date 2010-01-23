# Be sure to restart your server when you modify this file.

# Your secret key for verifying cookie session data integrity.
# If you change this key, all old sessions will become invalid!
# Make sure the secret is at least 30 characters and all random, 
# no regular words or you'll be exposed to dictionary attacks.
ActionController::Base.session = {
  :key         => '_structured_js_spike_session',
  :secret      => '8f986341586d6211376f62d7a23b1387ea3e06d315af46d61d316aafa9ea224b8ea48a65a3c8d8c27590588b7f4d885546dcd191b2985f8d1ac693c06c138d9e'
}

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rake db:sessions:create")
# ActionController::Base.session_store = :active_record_store
