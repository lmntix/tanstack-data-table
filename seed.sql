INSERT INTO transactions (
  id,
  reference,
  name,
  description,
  amount,
  currency,
  type,
  status,
  payment_method,
  counterparty_name,
  counterparty_account,
  category_slug,
  is_recurring,
  recurring_frequency,
  transaction_date,
  processed_at,
  created_at,
  updated_at,
  metadata,
  tags,
  notes,
  is_internal
)
SELECT
  gen_random_uuid(),
  md5(random()::text || clock_timestamp()::text),  -- unique reference
  initcap(md5(random()::text)),                    -- random name
  md5(random()::text),                             -- description
  round((random() * 5000 + 5)::numeric, 2),        -- amount between 5–5005
  'USD',
  (ARRAY['income','expense','transfer'])[floor(random()*3+1)]::transaction_type, -- CAST to enum
  (ARRAY['pending','completed','failed','cancelled'])[floor(random()*4+1)]::transaction_status, -- CAST
  (ARRAY['credit_card','debit_card','bank_transfer','cash','check','digital_wallet'])[floor(random()*6+1)]::payment_method, -- CAST
  initcap(md5(random()::text)),                    -- counterparty_name
  substr(md5(random()::text), 1, 10),              -- counterparty_account
  substr(md5(random()::text), 1, 8),               -- category_slug
  (random() < 0.5),                                -- is_recurring
  (ARRAY[NULL,'daily','weekly','monthly','yearly'])[floor(random()*5+1)], -- recurring_frequency
  NOW() - (random() * interval '365 days'),        -- transaction_date in past year
  NOW() - (random() * interval '10 days'),         -- processedAt recent
  NOW(),
  NOW(),
  json_build_object('ip', inet '192.168.0.1' + floor(random()*255)::int), -- metadata
  array_to_string(ARRAY[
    (ARRAY['food','rent','salary','utilities','travel','shopping'])[floor(random()*6+1)],
    (ARRAY['food','rent','salary','utilities','travel','shopping'])[floor(random()*6+1)]
  ], ','),
  md5(random()::text),                             -- notes
  (random() < 0.3)                                 -- is_internal
FROM generate_series(1, 300);
