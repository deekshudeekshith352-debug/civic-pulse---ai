-- Civic Pulse AI - Seed Data Dump (65 reports)

INSERT INTO public.issues (
  id, title, description, category, status, severity, size_estimate, safety_hazards,
  is_emergency, department, assigned_team, lat, lng, address, ward, upvotes,
  reporter_name, is_anonymous, sla_hours, sla_deadline, estimated_cost, images,
  resolution_photo, resolution_confidence, resolution_notes, citizen_confirmed, created_at, updated_at
) VALUES (
  'CP-1001', 'Severe Rim-Bending Crater on 80ft Road Junction', 'Deep asphalt depression with exposed ballast stone right at bus stop entrance. Vehicles swerving into oncoming traffic.', 'Potholes', 'In Progress', 8,
  '1.8m x 1.2m, depth 14cm', ARRAY['Two-wheeler skid risk', 'Sudden swerve into opposing lane', 'Near St. Joseph High School'], true, 'Public Works & Roads', 'Road Rapid Squad Alpha',
  12.9724, 77.6412, '80 Feet Rd, 12th Main, Indiranagar', 'Ward 12', 42,
  'Civic Vigilante', false, 24, '2026-10-24T14:57:55.477Z', 14400, ARRAY['https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80'],
  NULL, NULL, NULL, false, '2026-10-23T14:57:55.477Z', '2026-10-23T20:33:55.477Z'
) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, upvotes = EXCLUDED.upvotes;

INSERT INTO public.issues (
  id, title, description, category, status, severity, size_estimate, safety_hazards,
  is_emergency, department, assigned_team, lat, lng, address, ward, upvotes,
  reporter_name, is_anonymous, sla_hours, sla_deadline, estimated_cost, images,
  resolution_photo, resolution_confidence, resolution_notes, citizen_confirmed, created_at, updated_at
) VALUES (
  'CP-1002', 'Asphalt Trench & Edge Breakdown after Fiber Laying', 'Unpaved longitudinal trench across the road left uncompacted after telecom digging. Gravel flying upon vehicle transit.', 'Potholes', 'Assigned', 6,
  '8m trench x 0.4m wide', ARRAY['Loose stone projectiles', 'Dangerous bicycle trap'], false, 'Public Works & Roads', 'Contractor Unit Delta',
  12.9781, 77.6385, '100 Feet Rd, Near KFC Junction', 'Ward 12', 28,
  'Priya Sharma', false, 72, '2026-10-26T06:57:55.477Z', 20250, ARRAY['https://images.unsplash.com/photo-1578637387939-43c525550085?w=800&auto=format&fit=crop&q=80'],
  NULL, NULL, NULL, false, '2026-10-23T06:57:55.477Z', '2026-10-23T15:45:55.477Z'
) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, upvotes = EXCLUDED.upvotes;

INSERT INTO public.issues (
  id, title, description, category, status, severity, size_estimate, safety_hazards,
  is_emergency, department, assigned_team, lat, lng, address, ward, upvotes,
  reporter_name, is_anonymous, sla_hours, sla_deadline, estimated_cost, images,
  resolution_photo, resolution_confidence, resolution_notes, citizen_confirmed, created_at, updated_at
) VALUES (
  'CP-1003', 'Deep Cavity Formed Around Sinking Storm Manhole', 'Road surface collapsing around storm drain frame causing an 18cm drop on high speed corridor.', 'Potholes', 'Resolved', 9,
  '1.4m diameter, 18cm drop', ARRAY['Suspension damage', 'Severe crash risk for motorbikes'], true, 'Public Works & Roads', 'Emergency Road Squad',
  12.9352, 77.6245, 'Sony World Signal, Koramangala', 'Ward 45', 56,
  'Priya Sharma', false, 24, '2026-10-23T04:57:55.477Z', 24300, ARRAY['https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80'],
  'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f9?w=800&auto=format&fit=crop&q=80', 95, 'Asphalt compacted with vibrating roller and sealed flush with road grade.', true, '2026-10-22T04:57:55.477Z', '2026-10-23T00:09:55.477Z'
) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, upvotes = EXCLUDED.upvotes;

INSERT INTO public.issues (
  id, title, description, category, status, severity, size_estimate, safety_hazards,
  is_emergency, department, assigned_team, lat, lng, address, ward, upvotes,
  reporter_name, is_anonymous, sla_hours, sla_deadline, estimated_cost, images,
  resolution_photo, resolution_confidence, resolution_notes, citizen_confirmed, created_at, updated_at
) VALUES (
  'CP-1004', 'Multi-Pothole Cluster on Inner Ring Road Flyover Ramp', 'Series of 4 connected potholes eroding bridge approach span. Speed limit 50km/h creates high impact shock.', 'Potholes', 'Verified', 7,
  '4.5m x 2.0m zone', ARRAY['Loss of vehicle control on incline', 'Tailgate rear-end collisions'], false, 'Public Works & Roads', NULL,
  12.9389, 77.6315, 'Inner Ring Rd Ramp, Domlur Cross', 'Ward 45', 19,
  'Priya Sharma', false, 48, '2026-10-25T22:57:55.477Z', 17100, ARRAY['https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80'],
  NULL, NULL, NULL, false, '2026-10-23T22:57:55.477Z', '2026-10-24T01:21:55.477Z'
) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, upvotes = EXCLUDED.upvotes;

INSERT INTO public.issues (
  id, title, description, category, status, severity, size_estimate, safety_hazards,
  is_emergency, department, assigned_team, lat, lng, address, ward, upvotes,
  reporter_name, is_anonymous, sla_hours, sla_deadline, estimated_cost, images,
  resolution_photo, resolution_confidence, resolution_notes, citizen_confirmed, created_at, updated_at
) VALUES (
  'CP-1005', 'Sunken Bitumen Patch Outside General Hospital', 'Ambulance entrance has severe surface wash out causing heavy jolts to emergency vehicles transporting patients.', 'Potholes', 'In Progress', 8,
  '2.2m x 1.5m, 11cm depth', ARRAY['Critical delay to trauma ambulances', 'Stretcher jolt hazards'], true, 'Public Works & Roads', 'Hospital Corridor Priority Squad',
  12.9298, 77.5841, 'Rashtriya Vidyalaya Rd, Jayanagar', 'Ward 102', 35,
  'Civic Vigilante', false, 24, '2026-10-24T19:57:55.477Z', 13050, ARRAY['https://images.unsplash.com/photo-1578637387939-43c525550085?w=800&auto=format&fit=crop&q=80'],
  NULL, NULL, NULL, false, '2026-10-23T19:57:55.477Z', '2026-10-23T23:33:55.477Z'
) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, upvotes = EXCLUDED.upvotes;

INSERT INTO public.issues (
  id, title, description, category, status, severity, size_estimate, safety_hazards,
  is_emergency, department, assigned_team, lat, lng, address, ward, upvotes,
  reporter_name, is_anonymous, sla_hours, sla_deadline, estimated_cost, images,
  resolution_photo, resolution_confidence, resolution_notes, citizen_confirmed, created_at, updated_at
) VALUES (
  'CP-1006', 'Pavement Edge Collapse near Pedestrian Crossing', 'Curb line disintegrated into jagged rubble; elderly citizens tripping while accessing zebra crossing.', 'Potholes', 'Submitted', 5,
  '3m x 0.6m edge chunk', ARRAY['Pedestrian slip and fall', 'Wheelchair accessibility barrier'], false, 'Public Works & Roads', NULL,
  12.9812, 77.5684, '8th Cross, Sampige Rd, Malleshwaram', 'Ward 112', 12,
  'Priya Sharma', false, 72, '2026-10-27T01:57:55.477Z', 8550, ARRAY['https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80'],
  NULL, NULL, NULL, false, '2026-10-24T01:57:55.477Z', '2026-10-24T03:09:55.477Z'
) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, upvotes = EXCLUDED.upvotes;

INSERT INTO public.issues (
  id, title, description, category, status, severity, size_estimate, safety_hazards,
  is_emergency, department, assigned_team, lat, lng, address, ward, upvotes,
  reporter_name, is_anonymous, sla_hours, sla_deadline, estimated_cost, images,
  resolution_photo, resolution_confidence, resolution_notes, citizen_confirmed, created_at, updated_at
) VALUES (
  'CP-1007', 'Rainwater Filled Pothole Disguised as Puddle', 'Submerged 20cm pothole on waterlogged street. Three two-wheelers suffered rim breaks in past 2 hours.', 'Potholes', 'Assigned', 8,
  '1.5m diameter, 20cm depth', ARRAY['Hidden hazard underwater', 'Direct crash risk'], true, 'Public Works & Roads', 'Monsoon Quick Fix Team',
  12.9122, 77.6433, '27th Main Rd, HSR Layout Sector 1', 'Ward 84', 49,
  'Priya Sharma', true, 24, '2026-10-24T12:57:55.477Z', 11700, ARRAY['https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80'],
  NULL, NULL, NULL, false, '2026-10-23T12:57:55.477Z', '2026-10-23T19:21:55.477Z'
) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, upvotes = EXCLUDED.upvotes;

INSERT INTO public.issues (
  id, title, description, category, status, severity, size_estimate, safety_hazards,
  is_emergency, department, assigned_team, lat, lng, address, ward, upvotes,
  reporter_name, is_anonymous, sla_hours, sla_deadline, estimated_cost, images,
  resolution_photo, resolution_confidence, resolution_notes, citizen_confirmed, created_at, updated_at
) VALUES (
  'CP-1008', 'Broken Road Shoulder near Whitefield Tech Park', 'Heavy tech commuter bus traffic degraded the shoulder creating sharp 15cm asphalt drop-off.', 'Potholes', 'Resolved', 6,
  '12m shoulder degradation', ARRAY['Vehicular rollover if tires slip off edge'], false, 'Public Works & Roads', 'East Zone Road Crew',
  12.9698, 77.7499, 'ITPL Main Rd, Whitefield', 'Ward 78', 23,
  'Priya Sharma', false, 72, '2026-10-24T16:57:55.477Z', 26100, ARRAY['https://images.unsplash.com/photo-1578637387939-43c525550085?w=800&auto=format&fit=crop&q=80'],
  'https://images.unsplash.com/photo-1584463699042-45e052069650?w=800&auto=format&fit=crop&q=80', 95, 'Asphalt compacted with vibrating roller and sealed flush with road grade.', true, '2026-10-21T16:57:55.477Z', '2026-10-22T16:57:55.477Z'
) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, upvotes = EXCLUDED.upvotes;

INSERT INTO public.issues (
  id, title, description, category, status, severity, size_estimate, safety_hazards,
  is_emergency, department, assigned_team, lat, lng, address, ward, upvotes,
  reporter_name, is_anonymous, sla_hours, sla_deadline, estimated_cost, images,
  resolution_photo, resolution_confidence, resolution_notes, citizen_confirmed, created_at, updated_at
) VALUES (
  'CP-1009', 'Cave-in Subsurface Sinkhole on Commercial Street', 'Void detected under top asphalt layer with visible 30cm depression giving way under heavy vehicles.', 'Potholes', 'Verified', 9,
  '2m x 2m sinking crown', ARRAY['Imminent structural road collapse', 'Crowded market area'], true, 'Public Works & Roads', NULL,
  12.9822, 77.6085, 'Commercial Street, Tasker Town', 'Ward 14', 68,
  'Priya Sharma', false, 24, '2026-10-24T23:57:55.477Z', 36900, ARRAY['https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80'],
  NULL, NULL, NULL, false, '2026-10-23T23:57:55.477Z', '2026-10-24T01:57:55.477Z'
) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, upvotes = EXCLUDED.upvotes;

INSERT INTO public.issues (
  id, title, description, category, status, severity, size_estimate, safety_hazards,
  is_emergency, department, assigned_team, lat, lng, address, ward, upvotes,
  reporter_name, is_anonymous, sla_hours, sla_deadline, estimated_cost, images,
  resolution_photo, resolution_confidence, resolution_notes, citizen_confirmed, created_at, updated_at
) VALUES (
  'CP-1010', 'Speed Breaker Rubber Strip Torn and Nails Exposed', 'Metal bolts and torn speed bump anchors protruding 5cm from roadway puncturing vehicle tires.', 'Potholes', 'Resolved', 7,
  '3m strip width', ARRAY['Tire blowouts', 'Pedestrian footwear impalement'], false, 'Public Works & Roads', 'Traffic Engineering Cell',
  12.9245, 77.5899, '11th Main Rd, 4th Block Jayanagar', 'Ward 102', 31,
  'Priya Sharma', false, 48, '2026-10-23T04:57:55.477Z', 7200, ARRAY['https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80'],
  'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f9?w=800&auto=format&fit=crop&q=80', 95, 'Asphalt compacted with vibrating roller and sealed flush with road grade.', true, '2026-10-21T04:57:55.477Z', '2026-10-22T04:57:55.477Z'
) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, upvotes = EXCLUDED.upvotes;

INSERT INTO public.issues (
  id, title, description, category, status, severity, size_estimate, safety_hazards,
  is_emergency, department, assigned_team, lat, lng, address, ward, upvotes,
  reporter_name, is_anonymous, sla_hours, sla_deadline, estimated_cost, images,
  resolution_photo, resolution_confidence, resolution_notes, citizen_confirmed, created_at, updated_at
) VALUES (
  'CP-1011', 'Dark Zone: 5 Consecutive Street Lights Out Near Girls Hostel', 'Total blackness on 250m stretch of 14th Main Rd. Major safety concern for night shift workers and students.', 'Street Light', 'In Progress', 8,
  '250m street blackout (5 fixtures)', ARRAY['Severe personal safety & harassment risk', 'Zero pedestrian visibility'], true, 'Electricity & Lighting Dept', 'Lighting Rapid Maintenance Unit 2',
  12.9689, 77.6391, '14th Main Rd, HAL 2nd Stage, Indiranagar', 'Ward 12', 84,
  'Civic Vigilante', false, 24, '2026-10-24T17:57:55.477Z', 15750, ARRAY['https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80'],
  NULL, NULL, NULL, false, '2026-10-23T17:57:55.477Z', '2026-10-23T22:21:55.477Z'
) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, upvotes = EXCLUDED.upvotes;

INSERT INTO public.issues (
  id, title, description, category, status, severity, size_estimate, safety_hazards,
  is_emergency, department, assigned_team, lat, lng, address, ward, upvotes,
  reporter_name, is_anonymous, sla_hours, sla_deadline, estimated_cost, images,
  resolution_photo, resolution_confidence, resolution_notes, citizen_confirmed, created_at, updated_at
) VALUES (
  'CP-1012', 'Sparks Emitting from Hanging Overhead Lamp Cable', 'Wind caused insulator failure; sparks raining down onto sidewalk during intermittent drizzle.', 'Street Light', 'Verified', 10,
  'Live wire dangling at 2.1m height', ARRAY['Fatal electrocution hazard', 'Fire hazard to nearby trees and canopies'], true, 'Electricity & Lighting Dept', NULL,
  12.9341, 77.6189, '5th Block, Koramangala 1st A Cross', 'Ward 45', 95,
  'Priya Sharma', false, 24, '2026-10-25T02:57:55.477Z', 12600, ARRAY['https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?w=800&auto=format&fit=crop&q=80'],
  NULL, NULL, NULL, false, '2026-10-24T02:57:55.477Z', '2026-10-24T03:45:55.477Z'
) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, upvotes = EXCLUDED.upvotes;

INSERT INTO public.issues (
  id, title, description, category, status, severity, size_estimate, safety_hazards,
  is_emergency, department, assigned_team, lat, lng, address, ward, upvotes,
  reporter_name, is_anonymous, sla_hours, sla_deadline, estimated_cost, images,
  resolution_photo, resolution_confidence, resolution_notes, citizen_confirmed, created_at, updated_at
) VALUES (
  'CP-1013', 'Broken Glass Luminaire Hanging Dangerously by Cable', 'Heavy truck brushed against pole; lamp housing is suspended directly over pedestrian walking path.', 'Street Light', 'Resolved', 7,
  '15kg heavy metal luminaire', ARRAY['Falling object blunt trauma risk'], true, 'Electricity & Lighting Dept', 'Bucket Truck Crew 4',
  12.9741, 77.5921, 'MG Road, Trinity Metro Pillar 124', 'Ward 14', 43,
  'Priya Sharma', false, 24, '2026-10-23T16:57:55.477Z', 9450, ARRAY['https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80'],
  'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=800&auto=format&fit=crop&q=80', 95, 'Asphalt compacted with vibrating roller and sealed flush with road grade.', true, '2026-10-22T16:57:55.477Z', '2026-10-23T07:21:55.477Z'
) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, upvotes = EXCLUDED.upvotes;

INSERT INTO public.issues (
  id, title, description, category, status, severity, size_estimate, safety_hazards,
  is_emergency, department, assigned_team, lat, lng, address, ward, upvotes,
  reporter_name, is_anonymous, sla_hours, sla_deadline, estimated_cost, images,
  resolution_photo, resolution_confidence, resolution_notes, citizen_confirmed, created_at, updated_at
) VALUES (
  'CP-1014', 'Strobe-Flickering High Mast LED Causing Driver Distraction', 'Faulty driver module causing rapid 5Hz pulsing flash visible across the entire 4-way intersection.', 'Street Light', 'Assigned', 5,
  'High mast junction tower (8 floodlights)', ARRAY['Epileptic seizure trigger', 'Driver disorientation'], false, 'Electricity & Lighting Dept', 'High Mast Technical Team',
  12.9155, 77.6512, 'HSR Layout 14th Main Ring Junction', 'Ward 84', 27,
  'Priya Sharma', false, 72, '2026-10-26T02:57:55.477Z', 21600, ARRAY['https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?w=800&auto=format&fit=crop&q=80'],
  NULL, NULL, NULL, false, '2026-10-23T02:57:55.477Z', '2026-10-23T13:21:55.477Z'
) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, upvotes = EXCLUDED.upvotes;

INSERT INTO public.issues (
  id, title, description, category, status, severity, size_estimate, safety_hazards,
  is_emergency, department, assigned_team, lat, lng, address, ward, upvotes,
  reporter_name, is_anonymous, sla_hours, sla_deadline, estimated_cost, images,
  resolution_photo, resolution_confidence, resolution_notes, citizen_confirmed, created_at, updated_at
) VALUES (
  'CP-1015', 'Street Lamp Burning All Day Wasting Energy', 'Timer switch / photocell sensor jammed closed; lights on 24/7 for the past 6 days.', 'Street Light', 'Submitted', 2,
  '3 sodium vapor fixtures', ARRAY['Public energy wastage'], false, 'Electricity & Lighting Dept', NULL,
  12.9854, 77.5712, 'Margosa Rd, 15th Cross, Malleshwaram', 'Ward 112', 9,
  'Civic Vigilante', false, 72, '2026-10-26T20:57:55.477Z', 4275, ARRAY['https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80'],
  NULL, NULL, NULL, false, '2026-10-23T20:57:55.477Z', '2026-10-24T00:09:55.477Z'
) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, upvotes = EXCLUDED.upvotes;

INSERT INTO public.issues (
  id, title, description, category, status, severity, size_estimate, safety_hazards,
  is_emergency, department, assigned_team, lat, lng, address, ward, upvotes,
  reporter_name, is_anonymous, sla_hours, sla_deadline, estimated_cost, images,
  resolution_photo, resolution_confidence, resolution_notes, citizen_confirmed, created_at, updated_at
) VALUES (
  'CP-1016', 'Basement Junction Box Open with Uncapped Terminals', 'Light pole base door is missing; children playing nearby can touch live 230V busbars.', 'Street Light', 'In Progress', 10,
  'Ground-level inspection hatch', ARRAY['Child electrocution risk', 'Pet shock hazard'], true, 'Electricity & Lighting Dept', 'Emergency Wire Guard',
  12.9281, 77.5912, 'Near Madhavan Park, 3rd Block Jayanagar', 'Ward 102', 62,
  'Priya Sharma', false, 24, '2026-10-24T21:57:55.477Z', 5400, ARRAY['https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?w=800&auto=format&fit=crop&q=80'],
  NULL, NULL, NULL, false, '2026-10-23T21:57:55.477Z', '2026-10-24T00:45:55.477Z'
) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, upvotes = EXCLUDED.upvotes;

INSERT INTO public.issues (
  id, title, description, category, status, severity, size_estimate, safety_hazards,
  is_emergency, department, assigned_team, lat, lng, address, ward, upvotes,
  reporter_name, is_anonymous, sla_hours, sla_deadline, estimated_cost, images,
  resolution_photo, resolution_confidence, resolution_notes, citizen_confirmed, created_at, updated_at
) VALUES (
  'CP-1017', 'Pole Leaning 30 Degrees After Vehicle Impact', 'Tubular steel street pole bent outward, leaning towards the main roadway.', 'Street Light', 'Resolved', 8,
  '9m steel pole', ARRAY['Imminent collapse across road'], true, 'Electricity & Lighting Dept', 'Civil Recovery & Welding Team',
  12.9712, 77.7345, 'Whitefield Main Rd, Near Hope Farm', 'Ward 78', 38,
  'Priya Sharma', true, 24, '2026-10-23T02:57:55.477Z', 29250, ARRAY['https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80'],
  'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=800&auto=format&fit=crop&q=80', 95, 'Asphalt compacted with vibrating roller and sealed flush with road grade.', true, '2026-10-22T02:57:55.477Z', '2026-10-22T22:57:55.477Z'
) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, upvotes = EXCLUDED.upvotes;

INSERT INTO public.issues (
  id, title, description, category, status, severity, size_estimate, safety_hazards,
  is_emergency, department, assigned_team, lat, lng, address, ward, upvotes,
  reporter_name, is_anonymous, sla_hours, sla_deadline, estimated_cost, images,
  resolution_photo, resolution_confidence, resolution_notes, citizen_confirmed, created_at, updated_at
) VALUES (
  'CP-1018', 'Underpass Lighting 80% Dead Causing Blind Tunnel', 'Only 2 out of 16 tube fixtures working inside pedestrian and subway underpass.', 'Street Light', 'Assigned', 7,
  '60m subway underpass', ARRAY['Theft and mugging corridor', 'Elderly trip hazards'], false, 'Electricity & Lighting Dept', 'Subway Infrastructure Wing',
  12.9421, 77.6255, 'Koramangala 100ft Inner Ring Underpass', 'Ward 45', 51,
  'Priya Sharma', false, 48, '2026-10-24T22:57:55.477Z', 18450, ARRAY['https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?w=800&auto=format&fit=crop&q=80'],
  NULL, NULL, NULL, false, '2026-10-22T22:57:55.477Z', '2026-10-23T10:57:55.477Z'
) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, upvotes = EXCLUDED.upvotes;

INSERT INTO public.issues (
  id, title, description, category, status, severity, size_estimate, safety_hazards,
  is_emergency, department, assigned_team, lat, lng, address, ward, upvotes,
  reporter_name, is_anonymous, sla_hours, sla_deadline, estimated_cost, images,
  resolution_photo, resolution_confidence, resolution_notes, citizen_confirmed, created_at, updated_at
) VALUES (
  'CP-1019', 'Dim Low-Lumen Bulbs Obscuring Pedestrian Crosswalk', 'Lamps severely degraded; crosswalk is practically invisible to oncoming motorists at 40mph.', 'Street Light', 'Submitted', 6,
  '2 crosswalk poles', ARRAY['Pedestrian impact hazard'], false, 'Electricity & Lighting Dept', NULL,
  12.9322, 77.6789, 'Bellandur Outer Ring Road Crosswalk', 'Ward 56', 18,
  'Priya Sharma', false, 72, '2026-10-27T00:57:55.477Z', 6750, ARRAY['https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80'],
  NULL, NULL, NULL, false, '2026-10-24T00:57:55.477Z', '2026-10-24T02:33:55.477Z'
) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, upvotes = EXCLUDED.upvotes;

INSERT INTO public.issues (
  id, title, description, category, status, severity, size_estimate, safety_hazards,
  is_emergency, department, assigned_team, lat, lng, address, ward, upvotes,
  reporter_name, is_anonymous, sla_hours, sla_deadline, estimated_cost, images,
  resolution_photo, resolution_confidence, resolution_notes, citizen_confirmed, created_at, updated_at
) VALUES (
  'CP-1020', 'Tree Canopy Completely Enveloping Street Luminaire', 'Unpruned branches block 90% of light cone, leaving pavement beneath pitch black.', 'Street Light', 'Verified', 4,
  '1 overgrown tree crown', ARRAY['Darkened pedestrian footpath'], false, 'Electricity & Lighting Dept', NULL,
  12.9755, 77.6433, 'Defense Colony, 6th Main Indiranagar', 'Ward 12', 15,
  'Priya Sharma', false, 72, '2026-10-26T10:57:55.477Z', 4950, ARRAY['https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?w=800&auto=format&fit=crop&q=80'],
  NULL, NULL, NULL, false, '2026-10-23T10:57:55.477Z', '2026-10-23T18:09:55.477Z'
) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, upvotes = EXCLUDED.upvotes;

INSERT INTO public.issues (
  id, title, description, category, status, severity, size_estimate, safety_hazards,
  is_emergency, department, assigned_team, lat, lng, address, ward, upvotes,
  reporter_name, is_anonymous, sla_hours, sla_deadline, estimated_cost, images,
  resolution_photo, resolution_confidence, resolution_notes, citizen_confirmed, created_at, updated_at
) VALUES (
  'CP-1021', 'Illegal Dumping Site Blocking 50% of School Lane', 'Rotting organic food waste, discarded plastic crates, and construction rubble dumped overnight.', 'Garbage', 'In Progress', 7,
  '6.5 cubic meters, 15m strip', ARRAY['Severe bio-waste odor', 'Stray animal pack aggression', 'Blocking school bus access'], false, 'Sanitation & Solid Waste Dept', 'Sanitation Compactor Squad 7',
  12.9745, 77.6355, '10th Main, Near National Public School, Indiranagar', 'Ward 12', 76,
  'Civic Vigilante', false, 48, '2026-10-25T16:57:55.477Z', 9900, ARRAY['https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=800&auto=format&fit=crop&q=80'],
  NULL, NULL, NULL, false, '2026-10-23T16:57:55.477Z', '2026-10-23T21:45:55.477Z'
) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, upvotes = EXCLUDED.upvotes;

INSERT INTO public.issues (
  id, title, description, category, status, severity, size_estimate, safety_hazards,
  is_emergency, department, assigned_team, lat, lng, address, ward, upvotes,
  reporter_name, is_anonymous, sla_hours, sla_deadline, estimated_cost, images,
  resolution_photo, resolution_confidence, resolution_notes, citizen_confirmed, created_at, updated_at
) VALUES (
  'CP-1022', 'Commercial Restaurant Grease & Waste Dump on Footpath', 'Multiple black trash bags split open by dogs; rotten poultry waste and foul liquid leaking onto road.', 'Garbage', 'Assigned', 6,
  '12 large industrial bags', ARRAY['Slippery oil grease on walkway', 'Fly and pest infestation'], false, 'Sanitation & Solid Waste Dept', 'Commercial Waste Enforcement Team',
  12.9365, 77.6212, 'Koramangala 4th Block Restaurant Row', 'Ward 45', 45,
  'Priya Sharma', false, 72, '2026-10-26T08:57:55.477Z', 8100, ARRAY['https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80'],
  NULL, NULL, NULL, false, '2026-10-23T08:57:55.477Z', '2026-10-23T16:57:55.477Z'
) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, upvotes = EXCLUDED.upvotes;

INSERT INTO public.issues (
  id, title, description, category, status, severity, size_estimate, safety_hazards,
  is_emergency, department, assigned_team, lat, lng, address, ward, upvotes,
  reporter_name, is_anonymous, sla_hours, sla_deadline, estimated_cost, images,
  resolution_photo, resolution_confidence, resolution_notes, citizen_confirmed, created_at, updated_at
) VALUES (
  'CP-1023', 'Overflowing Municipal Community Bin Spilling into Canal', 'Bin has not been lifted for 5 days; trash is tumbling into adjacent stormwater canal causing blockage.', 'Garbage', 'Resolved', 8,
  '8 cubic meters overflow', ARRAY['Drain choke hazard', 'Waterway plastic pollution'], true, 'Sanitation & Solid Waste Dept', 'Heavy Tipper Crane 3',
  12.9301, 77.6712, 'Green Glen Layout, Bellandur', 'Ward 56', 61,
  'Priya Sharma', false, 24, '2026-10-23T08:57:55.477Z', 15300, ARRAY['https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=800&auto=format&fit=crop&q=80'],
  'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?w=800&auto=format&fit=crop&q=80', 95, 'Asphalt compacted with vibrating roller and sealed flush with road grade.', true, '2026-10-22T08:57:55.477Z', '2026-10-23T02:33:55.477Z'
) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, upvotes = EXCLUDED.upvotes;

INSERT INTO public.issues (
  id, title, description, category, status, severity, size_estimate, safety_hazards,
  is_emergency, department, assigned_team, lat, lng, address, ward, upvotes,
  reporter_name, is_anonymous, sla_hours, sla_deadline, estimated_cost, images,
  resolution_photo, resolution_confidence, resolution_notes, citizen_confirmed, created_at, updated_at
) VALUES (
  'CP-1024', 'Broken Glass Bottles & Construction Debris in Park', 'Shattered beer bottles and cement chunks left next to children swing set in community playground.', 'Garbage', 'Verified', 8,
  '20 sq.m playground area', ARRAY['Laceration and tetanus danger for children', 'Animal injury'], true, 'Sanitation & Solid Waste Dept', NULL,
  12.9234, 77.5855, 'Jayanagar 4th Block Park & Grounds', 'Ward 102', 82,
  'Priya Sharma', false, 24, '2026-10-24T20:57:55.477Z', 5850, ARRAY['https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80'],
  NULL, NULL, NULL, false, '2026-10-23T20:57:55.477Z', '2026-10-24T00:09:55.477Z'
) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, upvotes = EXCLUDED.upvotes;

INSERT INTO public.issues (
  id, title, description, category, status, severity, size_estimate, safety_hazards,
  is_emergency, department, assigned_team, lat, lng, address, ward, upvotes,
  reporter_name, is_anonymous, sla_hours, sla_deadline, estimated_cost, images,
  resolution_photo, resolution_confidence, resolution_notes, citizen_confirmed, created_at, updated_at
) VALUES (
  'CP-1025', 'Dry Leaves & Garden Waste Smoldering on Roadside', 'Unauthorized open burning of garden debris creating thick acrid smoke blinding morning traffic.', 'Garbage', 'In Progress', 8,
  '4m smoldering pile', ARRAY['Air pollution & respiratory distress', 'Wildfire spread to vehicles'], true, 'Sanitation & Solid Waste Dept', 'Air Quality & Fire Marshal Unit',
  12.9841, 77.5655, '11th Main, Malleshwaram West', 'Ward 112', 53,
  'Civic Vigilante', false, 24, '2026-10-25T01:57:55.477Z', 7200, ARRAY['https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=800&auto=format&fit=crop&q=80'],
  NULL, NULL, NULL, false, '2026-10-24T01:57:55.477Z', '2026-10-24T03:09:55.477Z'
) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, upvotes = EXCLUDED.upvotes;

INSERT INTO public.issues (
  id, title, description, category, status, severity, size_estimate, safety_hazards,
  is_emergency, department, assigned_team, lat, lng, address, ward, upvotes,
  reporter_name, is_anonymous, sla_hours, sla_deadline, estimated_cost, images,
  resolution_photo, resolution_confidence, resolution_notes, citizen_confirmed, created_at, updated_at
) VALUES (
  'CP-1026', 'Hazardous Medical Waste Syringes Found in Public Bin', 'Yellow clinical bags containing used syringes and IV sets abandoned beside normal street bin.', 'Garbage', 'Assigned', 10,
  '3 biohazard bags', ARRAY['Bloodborne pathogen transmission', 'Needle stick injury'], true, 'Sanitation & Solid Waste Dept', 'Biohazard Response Squad',
  12.9734, 77.6041, 'Brigade Road, Near Shoolay Circle', 'Ward 14', 110,
  'Priya Sharma', false, 24, '2026-10-24T13:57:55.477Z', 22050, ARRAY['https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80'],
  NULL, NULL, NULL, false, '2026-10-23T13:57:55.477Z', '2026-10-23T19:57:55.477Z'
) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, upvotes = EXCLUDED.upvotes;

INSERT INTO public.issues (
  id, title, description, category, status, severity, size_estimate, safety_hazards,
  is_emergency, department, assigned_team, lat, lng, address, ward, upvotes,
  reporter_name, is_anonymous, sla_hours, sla_deadline, estimated_cost, images,
  resolution_photo, resolution_confidence, resolution_notes, citizen_confirmed, created_at, updated_at
) VALUES (
  'CP-1027', 'Abandoned Old Sofa & Furniture Blocking Wheelchair Ramp', 'Discarded living room sectional sofa dumped right at the base of public library access ramp.', 'Garbage', 'Resolved', 4,
  '2.5m x 1.8m furniture item', ARRAY['Disabled pedestrian obstruction'], false, 'Sanitation & Solid Waste Dept', 'Bulky Waste Pickup 1',
  12.9189, 77.6499, 'Sector 2 Community Center, HSR Layout', 'Ward 84', 21,
  'Priya Sharma', true, 72, '2026-10-24T21:57:55.477Z', 5400, ARRAY['https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=800&auto=format&fit=crop&q=80'],
  'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?w=800&auto=format&fit=crop&q=80', 95, 'Asphalt compacted with vibrating roller and sealed flush with road grade.', true, '2026-10-21T21:57:55.477Z', '2026-10-22T19:57:55.477Z'
) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, upvotes = EXCLUDED.upvotes;

INSERT INTO public.issues (
  id, title, description, category, status, severity, size_estimate, safety_hazards,
  is_emergency, department, assigned_team, lat, lng, address, ward, upvotes,
  reporter_name, is_anonymous, sla_hours, sla_deadline, estimated_cost, images,
  resolution_photo, resolution_confidence, resolution_notes, citizen_confirmed, created_at, updated_at
) VALUES (
  'CP-1028', 'Electronic Waste & Discarded Batteries Dumped at Lake Edge', 'Broken CRTs, laptop batteries, and circuit boards dumped inside protected wetland perimeter.', 'Garbage', 'Verified', 7,
  '150kg hazardous e-waste', ARRAY['Heavy metal water contamination', 'Lithium battery combustion'], false, 'Sanitation & Solid Waste Dept', NULL,
  12.9344, 77.6811, 'Bellandur Lake Southern Shore', 'Ward 56', 49,
  'Priya Sharma', false, 48, '2026-10-25T09:57:55.477Z', 17100, ARRAY['https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80'],
  NULL, NULL, NULL, false, '2026-10-23T09:57:55.477Z', '2026-10-23T17:33:55.477Z'
) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, upvotes = EXCLUDED.upvotes;

INSERT INTO public.issues (
  id, title, description, category, status, severity, size_estimate, safety_hazards,
  is_emergency, department, assigned_team, lat, lng, address, ward, upvotes,
  reporter_name, is_anonymous, sla_hours, sla_deadline, estimated_cost, images,
  resolution_photo, resolution_confidence, resolution_notes, citizen_confirmed, created_at, updated_at
) VALUES (
  'CP-1029', 'Plastic Packaging Litter Across Metro Station Stairs', 'Heavy wind dispersed delivery packaging across 3 flights of pedestrian subway access stairs.', 'Garbage', 'Submitted', 3,
  '30m stairwell perimeter', ARRAY['Slip hazard on slick plastic'], false, 'Sanitation & Solid Waste Dept', NULL,
  12.9755, 77.7299, 'ITPL Metro Station Gate B', 'Ward 78', 14,
  'Priya Sharma', false, 72, '2026-10-27T02:57:55.477Z', 3600, ARRAY['https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=800&auto=format&fit=crop&q=80'],
  NULL, NULL, NULL, false, '2026-10-24T02:57:55.477Z', '2026-10-24T03:45:55.477Z'
) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, upvotes = EXCLUDED.upvotes;

INSERT INTO public.issues (
  id, title, description, category, status, severity, size_estimate, safety_hazards,
  is_emergency, department, assigned_team, lat, lng, address, ward, upvotes,
  reporter_name, is_anonymous, sla_hours, sla_deadline, estimated_cost, images,
  resolution_photo, resolution_confidence, resolution_notes, citizen_confirmed, created_at, updated_at
) VALUES (
  'CP-1030', 'Rotten Fruit Pile Outside Wholesale Market Gate', 'Produce vendors abandoned 2 truckloads of damaged melons and papayas fermenting in afternoon sun.', 'Garbage', 'Resolved', 6,
  '5 cubic meters rotting produce', ARRAY['Foul stench', 'Slippery roadway slush for motorbikes'], false, 'Sanitation & Solid Waste Dept', 'Market Cleaning Special Unit',
  12.9266, 77.5811, 'Jayanagar Shopping Complex Backlane', 'Ward 102', 39,
  'Priya Sharma', false, 72, '2026-10-24T11:57:55.477Z', 9450, ARRAY['https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80'],
  'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?w=800&auto=format&fit=crop&q=80', 95, 'Asphalt compacted with vibrating roller and sealed flush with road grade.', true, '2026-10-21T11:57:55.477Z', '2026-10-22T11:57:55.477Z'
) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, upvotes = EXCLUDED.upvotes;

INSERT INTO public.issues (
  id, title, description, category, status, severity, size_estimate, safety_hazards,
  is_emergency, department, assigned_team, lat, lng, address, ward, upvotes,
  reporter_name, is_anonymous, sla_hours, sla_deadline, estimated_cost, images,
  resolution_photo, resolution_confidence, resolution_notes, citizen_confirmed, created_at, updated_at
) VALUES (
  'CP-1031', 'Pressurized Main Pipe Burst Gushing Water 2m High', 'Major 300mm potable trunk line ruptured under pavement; thousands of gallons flowing down road.', 'Water Leakage', 'In Progress', 9,
  'Fountain height 2m, flooding 80m road', ARRAY['Critical potable water loss', 'Road sub-grade washout', 'Subsurface cave-in risk'], true, 'Water Supply & Sewerage Board', 'Trunk Pipeline Emergency Gang 1',
  12.9711, 77.6444, 'Double Road, Indiranagar', 'Ward 12', 92,
  'Civic Vigilante', false, 24, '2026-10-25T00:57:55.477Z', 38250, ARRAY['https://images.unsplash.com/photo-1584824486509-112e4181ff6b?w=800&auto=format&fit=crop&q=80'],
  NULL, NULL, NULL, false, '2026-10-24T00:57:55.477Z', '2026-10-24T02:33:55.477Z'
) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, upvotes = EXCLUDED.upvotes;

INSERT INTO public.issues (
  id, title, description, category, status, severity, size_estimate, safety_hazards,
  is_emergency, department, assigned_team, lat, lng, address, ward, upvotes,
  reporter_name, is_anonymous, sla_hours, sla_deadline, estimated_cost, images,
  resolution_photo, resolution_confidence, resolution_notes, citizen_confirmed, created_at, updated_at
) VALUES (
  'CP-1032', 'Underground Valve Leak Causing Perpetual Wet Slick', 'Clean water bubbling through asphalt cracks continuously for 2 weeks, growing moss on sidewalk.', 'Water Leakage', 'Assigned', 5,
  'Continuous seep ~8 LPM', ARRAY['Algae slip hazard for seniors', 'Asphalt delamination'], false, 'Water Supply & Sewerage Board', 'Valve Maintenance Unit B',
  12.9312, 77.6199, '7th Block, Koramangala 80ft Road', 'Ward 45', 33,
  'Priya Sharma', false, 72, '2026-10-26T00:57:55.477Z', 14400, ARRAY['https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?w=800&auto=format&fit=crop&q=80'],
  NULL, NULL, NULL, false, '2026-10-23T00:57:55.477Z', '2026-10-23T12:09:55.477Z'
) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, upvotes = EXCLUDED.upvotes;

INSERT INTO public.issues (
  id, title, description, category, status, severity, size_estimate, safety_hazards,
  is_emergency, department, assigned_team, lat, lng, address, ward, upvotes,
  reporter_name, is_anonymous, sla_hours, sla_deadline, estimated_cost, images,
  resolution_photo, resolution_confidence, resolution_notes, citizen_confirmed, created_at, updated_at
) VALUES (
  'CP-1033', 'Drinking Water Tap Standpost Broken and Continuously Running', 'Public drinking tap valve snapped off by vandals; potable water pouring non-stop into gutter.', 'Water Leakage', 'Resolved', 6,
  '25 LPM open flow', ARRAY['Wastage of scarce municipal drinking water'], false, 'Water Supply & Sewerage Board', 'Plumbing Rapid Squad',
  12.9199, 77.6455, 'Sector 3 Park Corner, HSR Layout', 'Ward 84', 41,
  'Priya Sharma', false, 72, '2026-10-25T12:57:55.477Z', 4950, ARRAY['https://images.unsplash.com/photo-1584824486509-112e4181ff6b?w=800&auto=format&fit=crop&q=80'],
  'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?w=800&auto=format&fit=crop&q=80', 95, 'Asphalt compacted with vibrating roller and sealed flush with road grade.', true, '2026-10-22T12:57:55.477Z', '2026-10-23T04:57:55.477Z'
) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, upvotes = EXCLUDED.upvotes;

INSERT INTO public.issues (
  id, title, description, category, status, severity, size_estimate, safety_hazards,
  is_emergency, department, assigned_team, lat, lng, address, ward, upvotes,
  reporter_name, is_anonymous, sla_hours, sla_deadline, estimated_cost, images,
  resolution_photo, resolution_confidence, resolution_notes, citizen_confirmed, created_at, updated_at
) VALUES (
  'CP-1034', 'Fire Hydrant Sheared by Delivery Truck', 'Cast iron fire hydrant knocked off its flange; powerful geyser drenching nearby storefronts.', 'Water Leakage', 'In Progress', 9,
  '100 PSI pressurized stream', ARRAY['Commercial property water damage', 'Zero fire suppression capability on block'], true, 'Water Supply & Sewerage Board', 'Hydrant Specialist Unit',
  12.9766, 77.6099, 'Residency Rd, Near Opera Junction', 'Ward 14', 88,
  'Priya Sharma', false, 24, '2026-10-25T01:57:55.477Z', 27900, ARRAY['https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?w=800&auto=format&fit=crop&q=80'],
  NULL, NULL, NULL, false, '2026-10-24T01:57:55.477Z', '2026-10-24T03:09:55.477Z'
) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, upvotes = EXCLUDED.upvotes;

INSERT INTO public.issues (
  id, title, description, category, status, severity, size_estimate, safety_hazards,
  is_emergency, department, assigned_team, lat, lng, address, ward, upvotes,
  reporter_name, is_anonymous, sla_hours, sla_deadline, estimated_cost, images,
  resolution_photo, resolution_confidence, resolution_notes, citizen_confirmed, created_at, updated_at
) VALUES (
  'CP-1035', 'Domestic Feeder Pipe Punctured During Road Milling', 'Road contractor bobcat punctured a 50mm PVC connection line cutting supply to 18 apartments.', 'Water Leakage', 'Verified', 6,
  '50mm feeder line', ARRAY['Drinking water supply outage to 18 families'], false, 'Water Supply & Sewerage Board', NULL,
  12.9811, 77.5699, 'East Park Rd, Malleshwaram', 'Ward 112', 27,
  'Civic Vigilante', false, 72, '2026-10-26T18:57:55.477Z', 10800, ARRAY['https://images.unsplash.com/photo-1584824486509-112e4181ff6b?w=800&auto=format&fit=crop&q=80'],
  NULL, NULL, NULL, false, '2026-10-23T18:57:55.477Z', '2026-10-23T22:57:55.477Z'
) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, upvotes = EXCLUDED.upvotes;

INSERT INTO public.issues (
  id, title, description, category, status, severity, size_estimate, safety_hazards,
  is_emergency, department, assigned_team, lat, lng, address, ward, upvotes,
  reporter_name, is_anonymous, sla_hours, sla_deadline, estimated_cost, images,
  resolution_photo, resolution_confidence, resolution_notes, citizen_confirmed, created_at, updated_at
) VALUES (
  'CP-1036', 'Subsurface Leak Undermining Retaining Wall', 'Unseen water leak softening soil behind stone masonry wall; cracks widening visibly.', 'Water Leakage', 'Verified', 8,
  '15m retaining wall slope', ARRAY['Retaining wall structural collapse onto highway'], true, 'Water Supply & Sewerage Board', NULL,
  12.9644, 77.7412, 'Varthur Main Rd, Whitefield', 'Ward 78', 64,
  'Priya Sharma', false, 24, '2026-10-24T12:57:55.477Z', 44100, ARRAY['https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?w=800&auto=format&fit=crop&q=80'],
  NULL, NULL, NULL, false, '2026-10-23T12:57:55.477Z', '2026-10-23T19:21:55.477Z'
) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, upvotes = EXCLUDED.upvotes;

INSERT INTO public.issues (
  id, title, description, category, status, severity, size_estimate, safety_hazards,
  is_emergency, department, assigned_team, lat, lng, address, ward, upvotes,
  reporter_name, is_anonymous, sla_hours, sla_deadline, estimated_cost, images,
  resolution_photo, resolution_confidence, resolution_notes, citizen_confirmed, created_at, updated_at
) VALUES (
  'CP-1037', 'Air Release Valve Spewing Muddy Water at Intersections', 'Air relief chamber on 400mm main failing to seal, spraying murky sediment slurry over road.', 'Water Leakage', 'Assigned', 5,
  '5m radius slurry pool', ARRAY['Reduced tire traction'], false, 'Water Supply & Sewerage Board', 'Valve Operations Cell',
  12.9255, 77.5877, 'Kanakanapalya Cross, Jayanagar', 'Ward 102', 19,
  'Priya Sharma', true, 72, '2026-10-26T04:57:55.477Z', 13050, ARRAY['https://images.unsplash.com/photo-1584824486509-112e4181ff6b?w=800&auto=format&fit=crop&q=80'],
  NULL, NULL, NULL, false, '2026-10-23T04:57:55.477Z', '2026-10-23T14:33:55.477Z'
) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, upvotes = EXCLUDED.upvotes;

INSERT INTO public.issues (
  id, title, description, category, status, severity, size_estimate, safety_hazards,
  is_emergency, department, assigned_team, lat, lng, address, ward, upvotes,
  reporter_name, is_anonymous, sla_hours, sla_deadline, estimated_cost, images,
  resolution_photo, resolution_confidence, resolution_notes, citizen_confirmed, created_at, updated_at
) VALUES (
  'CP-1038', 'Sewage Mixing with Leaking Potable Pipeline', 'Potable water pipe is submerged in sewage drain puddle; negative pressure suction risks contamination.', 'Water Leakage', 'In Progress', 10,
  'Critical contamination point', ARRAY['Cholera / typhoid epidemic threat', 'Immediate biological hazard'], true, 'Water Supply & Sewerage Board', 'Water Quality & Public Health Squad',
  12.9355, 77.6744, 'Bellandur Village Main Road', 'Ward 56', 125,
  'Priya Sharma', false, 24, '2026-10-24T23:57:55.477Z', 49500, ARRAY['https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?w=800&auto=format&fit=crop&q=80'],
  NULL, NULL, NULL, false, '2026-10-23T23:57:55.477Z', '2026-10-24T01:57:55.477Z'
) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, upvotes = EXCLUDED.upvotes;

INSERT INTO public.issues (
  id, title, description, category, status, severity, size_estimate, safety_hazards,
  is_emergency, department, assigned_team, lat, lng, address, ward, upvotes,
  reporter_name, is_anonymous, sla_hours, sla_deadline, estimated_cost, images,
  resolution_photo, resolution_confidence, resolution_notes, citizen_confirmed, created_at, updated_at
) VALUES (
  'CP-1039', 'Burst Overhead Tank Feeder at Community Health Center', 'Inlet pipe to clinic rooftop cistern broken; water pouring down building facade into electrical meter.', 'Water Leakage', 'Resolved', 8,
  'Clinic roof cascade', ARRAY['Electrical short circuit in medical center'], true, 'Water Supply & Sewerage Board', 'Urban Clinic Maintenance Cell',
  12.9733, 77.6388, '7th Main Indiranagar Health Dispensary', 'Ward 12', 47,
  'Priya Sharma', false, 24, '2026-10-23T14:57:55.477Z', 15300, ARRAY['https://images.unsplash.com/photo-1584824486509-112e4181ff6b?w=800&auto=format&fit=crop&q=80'],
  'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f9?w=800&auto=format&fit=crop&q=80', 95, 'Asphalt compacted with vibrating roller and sealed flush with road grade.', true, '2026-10-22T14:57:55.477Z', '2026-10-23T06:09:55.477Z'
) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, upvotes = EXCLUDED.upvotes;

INSERT INTO public.issues (
  id, title, description, category, status, severity, size_estimate, safety_hazards,
  is_emergency, department, assigned_team, lat, lng, address, ward, upvotes,
  reporter_name, is_anonymous, sla_hours, sla_deadline, estimated_cost, images,
  resolution_photo, resolution_confidence, resolution_notes, citizen_confirmed, created_at, updated_at
) VALUES (
  'CP-1040', 'Meter Pit Flooded and Overflowing onto Private Driveway', 'Defective consumer meter joint flooding parking garage with 10cm standing water.', 'Water Leakage', 'Submitted', 4,
  '1 meter pit, 20 sq.m pooling', ARRAY['Property basement seepage'], false, 'Water Supply & Sewerage Board', NULL,
  12.9144, 77.6422, 'Sector 1 19th Cross, HSR Layout', 'Ward 84', 11,
  'Priya Sharma', false, 72, '2026-10-27T03:57:55.477Z', 6300, ARRAY['https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?w=800&auto=format&fit=crop&q=80'],
  NULL, NULL, NULL, false, '2026-10-24T03:57:55.477Z', '2026-10-24T04:21:55.477Z'
) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, upvotes = EXCLUDED.upvotes;

INSERT INTO public.issues (
  id, title, description, category, status, severity, size_estimate, safety_hazards,
  is_emergency, department, assigned_team, lat, lng, address, ward, upvotes,
  reporter_name, is_anonymous, sla_hours, sla_deadline, estimated_cost, images,
  resolution_photo, resolution_confidence, resolution_notes, citizen_confirmed, created_at, updated_at
) VALUES (
  'CP-1041', 'Open Gaping Manhole with Broken Concrete Cover', 'Uncovered 2.5m deep sewer drop in middle of flooded crosswalk after rain. Highly dangerous for pedestrians.', 'Drainage Overflow', 'In Progress', 10,
  '70cm open hole, 2.5m depth', ARRAY['Fatal fall hazard for children/pedestrians', 'Automobile wheel entrapment'], true, 'Stormwater & Drainage Dept', 'Drainage Emergency Action Force',
  12.9377, 77.6255, '80 Feet Rd, Near Sony World, Koramangala', 'Ward 45', 142,
  'Civic Vigilante', false, 24, '2026-10-24T22:57:55.477Z', 18450, ARRAY['https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800&auto=format&fit=crop&q=80'],
  NULL, NULL, NULL, false, '2026-10-23T22:57:55.477Z', '2026-10-24T01:21:55.477Z'
) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, upvotes = EXCLUDED.upvotes;

INSERT INTO public.issues (
  id, title, description, category, status, severity, size_estimate, safety_hazards,
  is_emergency, department, assigned_team, lat, lng, address, ward, upvotes,
  reporter_name, is_anonymous, sla_hours, sla_deadline, estimated_cost, images,
  resolution_photo, resolution_confidence, resolution_notes, citizen_confirmed, created_at, updated_at
) VALUES (
  'CP-1042', 'Stormwater Culvert Blocked by Construction Silt', 'Culvert entrance choked with cement sacks and silt; 30cm of black water flooding 100m of road.', 'Drainage Overflow', 'In Progress', 8,
  '100m road section submerged 30cm', ARRAY['Hydroplaning collisions', 'Vehicular engine water ingestion', 'Stagnant mosquito breeding'], true, 'Stormwater & Drainage Dept', 'Excavator Desilting Unit 5',
  12.9766, 77.6488, '100 Feet Rd, Near CMH Rd Junction', 'Ward 12', 77,
  'Priya Sharma', false, 24, '2026-10-24T10:57:55.477Z', 33750, ARRAY['https://images.unsplash.com/photo-1517824806704-9040b037703b?w=800&auto=format&fit=crop&q=80'],
  NULL, NULL, NULL, false, '2026-10-23T10:57:55.477Z', '2026-10-23T18:09:55.477Z'
) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, upvotes = EXCLUDED.upvotes;

INSERT INTO public.issues (
  id, title, description, category, status, severity, size_estimate, safety_hazards,
  is_emergency, department, assigned_team, lat, lng, address, ward, upvotes,
  reporter_name, is_anonymous, sla_hours, sla_deadline, estimated_cost, images,
  resolution_photo, resolution_confidence, resolution_notes, citizen_confirmed, created_at, updated_at
) VALUES (
  'CP-1043', 'Foul Sewage Sullage Backing up into Residential Basements', 'Trunk sewer line choked downstream; domestic toilets and parking garages bubbling foul blackwater.', 'Drainage Overflow', 'Assigned', 9,
  'Affecting 8 residential apartment blocks', ARRAY['Acute bio-hazard & disease outbreak', 'Basement electrical inverter flooding'], true, 'Stormwater & Drainage Dept', 'Suction Jetting Super Sucker 2',
  12.9322, 77.6755, 'Bellandur Lake Rd, Near Sobha Jasmine', 'Ward 56', 118,
  'Priya Sharma', false, 24, '2026-10-24T15:57:55.477Z', 40050, ARRAY['https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800&auto=format&fit=crop&q=80'],
  NULL, NULL, NULL, false, '2026-10-23T15:57:55.477Z', '2026-10-23T21:09:55.477Z'
) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, upvotes = EXCLUDED.upvotes;

INSERT INTO public.issues (
  id, title, description, category, status, severity, size_estimate, safety_hazards,
  is_emergency, department, assigned_team, lat, lng, address, ward, upvotes,
  reporter_name, is_anonymous, sla_hours, sla_deadline, estimated_cost, images,
  resolution_photo, resolution_confidence, resolution_notes, citizen_confirmed, created_at, updated_at
) VALUES (
  'CP-1044', 'Missing Cast Iron Drain Grating Along Bike Lane', 'Scrap thieves stole 4 drain grates along designated cycle path leaving 40cm wide trenches open.', 'Drainage Overflow', 'Resolved', 8,
  '4 missing grates (1.2m each)', ARRAY['Severe cycling flip crashes', 'Broken limbs for runners'], true, 'Stormwater & Drainage Dept', 'Foundry & Grate Fast Install Team',
  12.9211, 77.6411, 'HSR Layout 27th Main Cycling Corridor', 'Ward 84', 63,
  'Priya Sharma', false, 24, '2026-10-23T10:57:55.477Z', 23400, ARRAY['https://images.unsplash.com/photo-1517824806704-9040b037703b?w=800&auto=format&fit=crop&q=80'],
  'https://images.unsplash.com/photo-1584463699042-45e052069650?w=800&auto=format&fit=crop&q=80', 95, 'Asphalt compacted with vibrating roller and sealed flush with road grade.', true, '2026-10-22T10:57:55.477Z', '2026-10-23T03:45:55.477Z'
) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, upvotes = EXCLUDED.upvotes;

INSERT INTO public.issues (
  id, title, description, category, status, severity, size_estimate, safety_hazards,
  is_emergency, department, assigned_team, lat, lng, address, ward, upvotes,
  reporter_name, is_anonymous, sla_hours, sla_deadline, estimated_cost, images,
  resolution_photo, resolution_confidence, resolution_notes, citizen_confirmed, created_at, updated_at
) VALUES (
  'CP-1045', 'Rainwater Retention Drain Overgrown with Invasive Weeds', 'Canal capacity reduced by 85% due to dense shrubs and silt deposits before expected monsoon rains.', 'Drainage Overflow', 'Verified', 6,
  '180m canal section', ARRAY['Imminent flash flooding risk in upcoming storm'], false, 'Stormwater & Drainage Dept', NULL,
  12.9288, 77.5833, '32nd Cross, 7th Block Jayanagar', 'Ward 102', 34,
  'Civic Vigilante', false, 72, '2026-10-26T07:57:55.477Z', 30150, ARRAY['https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800&auto=format&fit=crop&q=80'],
  NULL, NULL, NULL, false, '2026-10-23T07:57:55.477Z', '2026-10-23T16:21:55.477Z'
) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, upvotes = EXCLUDED.upvotes;

INSERT INTO public.issues (
  id, title, description, category, status, severity, size_estimate, safety_hazards,
  is_emergency, department, assigned_team, lat, lng, address, ward, upvotes,
  reporter_name, is_anonymous, sla_hours, sla_deadline, estimated_cost, images,
  resolution_photo, resolution_confidence, resolution_notes, citizen_confirmed, created_at, updated_at
) VALUES (
  'CP-1046', 'Retaining Stone Wall of Main Drain Collapsed into Waterway', 'Heavy rain undermined the stone pitching; 15m of masonry wall fell inward blocking stream.', 'Drainage Overflow', 'Assigned', 8,
  '15m masonry section collapsed', ARRAY['Total flow impediment causing backwater flood'], true, 'Stormwater & Drainage Dept', 'Heavy Earthmover Gang 4',
  12.9833, 77.5644, '18th Cross Rajajinagar Boundary, Malleshwaram', 'Ward 112', 52,
  'Priya Sharma', false, 24, '2026-10-23T23:57:55.477Z', 60750, ARRAY['https://images.unsplash.com/photo-1517824806704-9040b037703b?w=800&auto=format&fit=crop&q=80'],
  NULL, NULL, NULL, false, '2026-10-22T23:57:55.477Z', '2026-10-23T11:33:55.477Z'
) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, upvotes = EXCLUDED.upvotes;

INSERT INTO public.issues (
  id, title, description, category, status, severity, size_estimate, safety_hazards,
  is_emergency, department, assigned_team, lat, lng, address, ward, upvotes,
  reporter_name, is_anonymous, sla_hours, sla_deadline, estimated_cost, images,
  resolution_photo, resolution_confidence, resolution_notes, citizen_confirmed, created_at, updated_at
) VALUES (
  'CP-1047', 'Storm Drain Sump Silt Accumulation Near Hospital Gate', 'Sediment buildup has choked catch basin; oily street runoff stagnating in front of casualty ward.', 'Drainage Overflow', 'Resolved', 7,
  '4 catch basins', ARRAY['Patient ambulance access impeded by 15cm puddle'], false, 'Stormwater & Drainage Dept', 'Drain Silt Clearing Unit',
  12.9788, 77.6077, 'Bowring Hospital Rd, Tasker Town', 'Ward 14', 49,
  'Priya Sharma', true, 48, '2026-10-24T00:57:55.477Z', 13950, ARRAY['https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800&auto=format&fit=crop&q=80'],
  'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?w=800&auto=format&fit=crop&q=80', 95, 'Asphalt compacted with vibrating roller and sealed flush with road grade.', true, '2026-10-22T00:57:55.477Z', '2026-10-22T21:45:55.477Z'
) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, upvotes = EXCLUDED.upvotes;

INSERT INTO public.issues (
  id, title, description, category, status, severity, size_estimate, safety_hazards,
  is_emergency, department, assigned_team, lat, lng, address, ward, upvotes,
  reporter_name, is_anonymous, sla_hours, sla_deadline, estimated_cost, images,
  resolution_photo, resolution_confidence, resolution_notes, citizen_confirmed, created_at, updated_at
) VALUES (
  'CP-1048', 'Broken Plastic Barricade Fallen into Open Canal', 'Temporary road works barrier fell inside culvert mouth collecting debris and trapping plastic waste.', 'Drainage Overflow', 'Submitted', 4,
  '2 plastic jersey barriers', ARRAY['Partial flow obstruction'], false, 'Stormwater & Drainage Dept', NULL,
  12.9677, 77.7466, 'Whitefield Railway Station Approach', 'Ward 78', 16,
  'Priya Sharma', false, 72, '2026-10-26T21:57:55.477Z', 4050, ARRAY['https://images.unsplash.com/photo-1517824806704-9040b037703b?w=800&auto=format&fit=crop&q=80'],
  NULL, NULL, NULL, false, '2026-10-23T21:57:55.477Z', '2026-10-24T00:45:55.477Z'
) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, upvotes = EXCLUDED.upvotes;

INSERT INTO public.issues (
  id, title, description, category, status, severity, size_estimate, safety_hazards,
  is_emergency, department, assigned_team, lat, lng, address, ward, upvotes,
  reporter_name, is_anonymous, sla_hours, sla_deadline, estimated_cost, images,
  resolution_photo, resolution_confidence, resolution_notes, citizen_confirmed, created_at, updated_at
) VALUES (
  'CP-1049', 'Toxic Foam Rising from Stormwater Overflow Weir', 'Chemical detergent runoff causing 1.5m high frothing spillover across public walkway during drizzle.', 'Drainage Overflow', 'In Progress', 9,
  '1.5m foam cloud, 40m perimeter', ARRAY['Chemical skin irritant', 'Airborne aerosolized pathogens'], true, 'Stormwater & Drainage Dept', 'Pollution Control Chemical Team',
  12.9366, 77.6722, 'Bellandur Outlet Weir, Yemalur Road', 'Ward 56', 160,
  'Priya Sharma', false, 24, '2026-10-24T18:57:55.477Z', 54000, ARRAY['https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800&auto=format&fit=crop&q=80'],
  NULL, NULL, NULL, false, '2026-10-23T18:57:55.477Z', '2026-10-23T22:57:55.477Z'
) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, upvotes = EXCLUDED.upvotes;

INSERT INTO public.issues (
  id, title, description, category, status, severity, size_estimate, safety_hazards,
  is_emergency, department, assigned_team, lat, lng, address, ward, upvotes,
  reporter_name, is_anonymous, sla_hours, sla_deadline, estimated_cost, images,
  resolution_photo, resolution_confidence, resolution_notes, citizen_confirmed, created_at, updated_at
) VALUES (
  'CP-1050', 'Concrete Slab Shifted Over Footpath Drain Leaving Trap', 'Pedestrian walkway precast slab fractured in half; dark void underneath concealed at dusk.', 'Drainage Overflow', 'Resolved', 6,
  '1 precast slab (1.5m x 0.8m)', ARRAY['Leg fracture trap for pedestrians'], false, 'Stormwater & Drainage Dept', 'Precast Slab Quick Response',
  12.9733, 77.6411, 'Chinmaya Mission Hospital Rd, Indiranagar', 'Ward 12', 38,
  'Priya Sharma', false, 72, '2026-10-24T08:57:55.477Z', 8100, ARRAY['https://images.unsplash.com/photo-1517824806704-9040b037703b?w=800&auto=format&fit=crop&q=80'],
  'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f9?w=800&auto=format&fit=crop&q=80', 95, 'Asphalt compacted with vibrating roller and sealed flush with road grade.', true, '2026-10-21T08:57:55.477Z', '2026-10-22T08:57:55.477Z'
) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, upvotes = EXCLUDED.upvotes;

INSERT INTO public.issues (
  id, title, description, category, status, severity, size_estimate, safety_hazards,
  is_emergency, department, assigned_team, lat, lng, address, ward, upvotes,
  reporter_name, is_anonymous, sla_hours, sla_deadline, estimated_cost, images,
  resolution_photo, resolution_confidence, resolution_notes, citizen_confirmed, created_at, updated_at
) VALUES (
  'CP-1051', 'Pothole on School Bus Route Creating Severe Axle Stress', 'Large pothole on narrower residential lane causing school buses to mount walkway.', 'Potholes', 'Verified', 7,
  '1.6m x 1.1m', ARRAY['Pedestrian safety on school bus route'], false, 'Public Works & Roads', NULL,
  12.9277, 77.5866, '9th Main, Jayanagar 5th Block', 'Ward 102', 29,
  'Civic Vigilante', false, 48, '2026-10-25T13:57:55.477Z', 11700, ARRAY['https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80'],
  NULL, NULL, NULL, false, '2026-10-23T13:57:55.477Z', '2026-10-23T19:57:55.477Z'
) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, upvotes = EXCLUDED.upvotes;

INSERT INTO public.issues (
  id, title, description, category, status, severity, size_estimate, safety_hazards,
  is_emergency, department, assigned_team, lat, lng, address, ward, upvotes,
  reporter_name, is_anonymous, sla_hours, sla_deadline, estimated_cost, images,
  resolution_photo, resolution_confidence, resolution_notes, citizen_confirmed, created_at, updated_at
) VALUES (
  'CP-1052', 'Overhead Street Lamp Bracket Rusted and Swinging in Wind', 'Corroded bracket arm making grinding noise; liable to break off in sudden squall.', 'Street Light', 'Assigned', 7,
  'Single 12kg fixture arm', ARRAY['High wind falling hazard'], false, 'Electricity & Lighting Dept', 'Pole Inspection Squad 1',
  12.9722, 77.6366, '12th Main Indiranagar, Near Corner House', 'Ward 12', 32,
  'Priya Sharma', false, 48, '2026-10-25T03:57:55.477Z', 7650, ARRAY['https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80'],
  NULL, NULL, NULL, false, '2026-10-23T03:57:55.477Z', '2026-10-23T13:57:55.477Z'
) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, upvotes = EXCLUDED.upvotes;

INSERT INTO public.issues (
  id, title, description, category, status, severity, size_estimate, safety_hazards,
  is_emergency, department, assigned_team, lat, lng, address, ward, upvotes,
  reporter_name, is_anonymous, sla_hours, sla_deadline, estimated_cost, images,
  resolution_photo, resolution_confidence, resolution_notes, citizen_confirmed, created_at, updated_at
) VALUES (
  'CP-1053', 'Overflowing Plastic Waste Behind Tech Park Cafeteria', 'Over 40 large garbage bins uncollected; birds scattering plastic packaging over nearby road.', 'Garbage', 'In Progress', 5,
  '7 cubic meters', ARRAY['Microplastic dispersal', 'Blocked gutters'], false, 'Sanitation & Solid Waste Dept', 'IT Corridor Waste Unit',
  12.9711, 77.7388, 'Sigma Soft Tech Park, Whitefield', 'Ward 78', 41,
  'Priya Sharma', false, 72, '2026-10-26T20:57:55.477Z', 13050, ARRAY['https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=800&auto=format&fit=crop&q=80'],
  NULL, NULL, NULL, false, '2026-10-23T20:57:55.477Z', '2026-10-24T00:09:55.477Z'
) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, upvotes = EXCLUDED.upvotes;

INSERT INTO public.issues (
  id, title, description, category, status, severity, size_estimate, safety_hazards,
  is_emergency, department, assigned_team, lat, lng, address, ward, upvotes,
  reporter_name, is_anonymous, sla_hours, sla_deadline, estimated_cost, images,
  resolution_photo, resolution_confidence, resolution_notes, citizen_confirmed, created_at, updated_at
) VALUES (
  'CP-1054', 'Water Leak Flooding Metro Escalator Landing Pit', 'Underground municipal pipe seepage entering subway escalator sump causing shutdown.', 'Water Leakage', 'In Progress', 8,
  '400L/hr continuous seepage', ARRAY['Escalator mechanical short circuit', 'Commuter congestion'], true, 'Water Supply & Sewerage Board', 'Metro Transit Utility Squad',
  12.9755, 77.6066, 'MG Road Metro Station North Concourse', 'Ward 14', 79,
  'Priya Sharma', false, 24, '2026-10-24T17:57:55.477Z', 32400, ARRAY['https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?w=800&auto=format&fit=crop&q=80'],
  NULL, NULL, NULL, false, '2026-10-23T17:57:55.477Z', '2026-10-23T22:21:55.477Z'
) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, upvotes = EXCLUDED.upvotes;

INSERT INTO public.issues (
  id, title, description, category, status, severity, size_estimate, safety_hazards,
  is_emergency, department, assigned_team, lat, lng, address, ward, upvotes,
  reporter_name, is_anonymous, sla_hours, sla_deadline, estimated_cost, images,
  resolution_photo, resolution_confidence, resolution_notes, citizen_confirmed, created_at, updated_at
) VALUES (
  'CP-1055', 'Drain Grate Clogged with Dead Tree Leaves & Debris', 'Seasonal leaf fall blocked all 8 openings of stormwater intake before residential row.', 'Drainage Overflow', 'Resolved', 5,
  '8 intake slots', ARRAY['Street ponding in light rain'], false, 'Stormwater & Drainage Dept', 'Ward Maintenance Gang 4',
  12.9177, 77.6433, 'Sector 2 17th Cross, HSR Layout', 'Ward 84', 24,
  'Civic Vigilante', false, 72, '2026-10-25T03:57:55.477Z', 4950, ARRAY['https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800&auto=format&fit=crop&q=80'],
  'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?w=800&auto=format&fit=crop&q=80', 95, 'Asphalt compacted with vibrating roller and sealed flush with road grade.', true, '2026-10-22T03:57:55.477Z', '2026-10-22T23:33:55.477Z'
) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, upvotes = EXCLUDED.upvotes;

INSERT INTO public.issues (
  id, title, description, category, status, severity, size_estimate, safety_hazards,
  is_emergency, department, assigned_team, lat, lng, address, ward, upvotes,
  reporter_name, is_anonymous, sla_hours, sla_deadline, estimated_cost, images,
  resolution_photo, resolution_confidence, resolution_notes, citizen_confirmed, created_at, updated_at
) VALUES (
  'CP-1056', 'Pothole on High-Speed Flyover Descent', 'Unmarked 12cm pothole right at bottom of ramp where vehicles travel at 60 km/h.', 'Potholes', 'Assigned', 8,
  '1.2m x 0.9m, 12cm depth', ARRAY['High-speed blowout', 'Multi-car pileup risk'], true, 'Public Works & Roads', 'Flyover Maintenance Unit',
  12.9411, 77.6288, 'Domlur Flyover South Exit', 'Ward 45', 55,
  'Priya Sharma', false, 24, '2026-10-24T11:57:55.477Z', 16200, ARRAY['https://images.unsplash.com/photo-1578637387939-43c525550085?w=800&auto=format&fit=crop&q=80'],
  NULL, NULL, NULL, false, '2026-10-23T11:57:55.477Z', '2026-10-23T18:45:55.477Z'
) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, upvotes = EXCLUDED.upvotes;

INSERT INTO public.issues (
  id, title, description, category, status, severity, size_estimate, safety_hazards,
  is_emergency, department, assigned_team, lat, lng, address, ward, upvotes,
  reporter_name, is_anonymous, sla_hours, sla_deadline, estimated_cost, images,
  resolution_photo, resolution_confidence, resolution_notes, citizen_confirmed, created_at, updated_at
) VALUES (
  'CP-1057', 'Dead Animal Carcass on Main Highway Verge', 'Deceased stray cattle on roadside verge causing severe biohazard and vehicle distraction.', 'Garbage', 'Resolved', 8,
  'Highway verge', ARRAY['Public health emergency', 'Sudden vehicular swerve risk'], true, 'Sanitation & Solid Waste Dept', 'Animal Welfare & Sanitation Emergency',
  12.9377, 77.6822, 'Outer Ring Road, Near Bellandur Flyover', 'Ward 56', 89,
  'Priya Sharma', true, 24, '2026-10-23T20:57:55.477Z', 11250, ARRAY['https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80'],
  'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?w=800&auto=format&fit=crop&q=80', 95, 'Asphalt compacted with vibrating roller and sealed flush with road grade.', true, '2026-10-22T20:57:55.477Z', '2026-10-23T09:45:55.477Z'
) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, upvotes = EXCLUDED.upvotes;

INSERT INTO public.issues (
  id, title, description, category, status, severity, size_estimate, safety_hazards,
  is_emergency, department, assigned_team, lat, lng, address, ward, upvotes,
  reporter_name, is_anonymous, sla_hours, sla_deadline, estimated_cost, images,
  resolution_photo, resolution_confidence, resolution_notes, citizen_confirmed, created_at, updated_at
) VALUES (
  'CP-1058', 'Solar Street Light Battery Stolen and Panel Damaged', 'Stand-alone renewable street light fixture stripped; wires dangling at arm reach.', 'Street Light', 'Verified', 5,
  '1 solar lighting unit', ARRAY['Dark intersection', 'Vandalized electronics'], false, 'Electricity & Lighting Dept', NULL,
  12.9866, 77.5677, 'Malleshwaram 17th Cross Park Boundary', 'Ward 112', 18,
  'Priya Sharma', false, 72, '2026-10-26T05:57:55.477Z', 14400, ARRAY['https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?w=800&auto=format&fit=crop&q=80'],
  NULL, NULL, NULL, false, '2026-10-23T05:57:55.477Z', '2026-10-23T15:09:55.477Z'
) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, upvotes = EXCLUDED.upvotes;

INSERT INTO public.issues (
  id, title, description, category, status, severity, size_estimate, safety_hazards,
  is_emergency, department, assigned_team, lat, lng, address, ward, upvotes,
  reporter_name, is_anonymous, sla_hours, sla_deadline, estimated_cost, images,
  resolution_photo, resolution_confidence, resolution_notes, citizen_confirmed, created_at, updated_at
) VALUES (
  'CP-1059', 'Pipeline Joint Burst Sprinkling Mud over Parking Bays', 'High pressure joint weeping fine spray of sediment-laden water on parked commuter cars.', 'Water Leakage', 'Submitted', 4,
  '15 LPM leak', ARRAY['Water wastage and vehicle paint erosion'], false, 'Water Supply & Sewerage Board', NULL,
  12.9733, 77.6477, '100ft Rd Indiranagar, Near Starbucks', 'Ward 12', 14,
  'Priya Sharma', false, 72, '2026-10-27T02:57:55.477Z', 8550, ARRAY['https://images.unsplash.com/photo-1584824486509-112e4181ff6b?w=800&auto=format&fit=crop&q=80'],
  NULL, NULL, NULL, false, '2026-10-24T02:57:55.477Z', '2026-10-24T03:45:55.477Z'
) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, upvotes = EXCLUDED.upvotes;

INSERT INTO public.issues (
  id, title, description, category, status, severity, size_estimate, safety_hazards,
  is_emergency, department, assigned_team, lat, lng, address, ward, upvotes,
  reporter_name, is_anonymous, sla_hours, sla_deadline, estimated_cost, images,
  resolution_photo, resolution_confidence, resolution_notes, citizen_confirmed, created_at, updated_at
) VALUES (
  'CP-1060', 'Sewer Gas Odor and Bubble Up from Road Crack', 'Intense methane / sewer gas odor escaping from road cracks near dining patio.', 'Drainage Overflow', 'Verified', 7,
  '10m street section', ARRAY['Combustible gas buildup', 'Nausea and respiratory irritation'], true, 'Stormwater & Drainage Dept', NULL,
  12.9333, 77.6211, 'Koramangala 5th Block, 1st Cross', 'Ward 45', 67,
  'Priya Sharma', false, 24, '2026-10-24T14:57:55.477Z', 22950, ARRAY['https://images.unsplash.com/photo-1517824806704-9040b037703b?w=800&auto=format&fit=crop&q=80'],
  NULL, NULL, NULL, false, '2026-10-23T14:57:55.477Z', '2026-10-23T20:33:55.477Z'
) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, upvotes = EXCLUDED.upvotes;

INSERT INTO public.issues (
  id, title, description, category, status, severity, size_estimate, safety_hazards,
  is_emergency, department, assigned_team, lat, lng, address, ward, upvotes,
  reporter_name, is_anonymous, sla_hours, sla_deadline, estimated_cost, images,
  resolution_photo, resolution_confidence, resolution_notes, citizen_confirmed, created_at, updated_at
) VALUES (
  'CP-1061', 'Broken Paver Blocks Tripping Morning Walkers', 'Walkway paving loosened by tree roots with loose bricks jutting out 6cm high.', 'Potholes', 'Resolved', 4,
  '15 sq.m footpath', ARRAY['Trip hazard for elderly walkers'], false, 'Public Works & Roads', 'Footpath Restoration Squad',
  12.9255, 77.5844, 'South End Circle, Jayanagar', 'Ward 102', 22,
  'Civic Vigilante', false, 72, '2026-10-24T02:57:55.477Z', 6300, ARRAY['https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80'],
  'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f9?w=800&auto=format&fit=crop&q=80', 95, 'Asphalt compacted with vibrating roller and sealed flush with road grade.', true, '2026-10-21T02:57:55.477Z', '2026-10-22T02:57:55.477Z'
) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, upvotes = EXCLUDED.upvotes;

INSERT INTO public.issues (
  id, title, description, category, status, severity, size_estimate, safety_hazards,
  is_emergency, department, assigned_team, lat, lng, address, ward, upvotes,
  reporter_name, is_anonymous, sla_hours, sla_deadline, estimated_cost, images,
  resolution_photo, resolution_confidence, resolution_notes, citizen_confirmed, created_at, updated_at
) VALUES (
  'CP-1062', 'Flickering Neon Commercial Billboard Blinding Traffic Light', 'Unauthorized LED billboard directly adjacent to traffic signal creating severe glare.', 'Street Light', 'Submitted', 6,
  '1 billboard installation', ARRAY['Traffic signal obscuration'], false, 'Electricity & Lighting Dept', NULL,
  12.9777, 77.6044, 'Mayo Hall Junction, MG Road', 'Ward 14', 36,
  'Priya Sharma', false, 72, '2026-10-26T23:57:55.477Z', 6750, ARRAY['https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80'],
  NULL, NULL, NULL, false, '2026-10-23T23:57:55.477Z', '2026-10-24T01:57:55.477Z'
) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, upvotes = EXCLUDED.upvotes;

INSERT INTO public.issues (
  id, title, description, category, status, severity, size_estimate, safety_hazards,
  is_emergency, department, assigned_team, lat, lng, address, ward, upvotes,
  reporter_name, is_anonymous, sla_hours, sla_deadline, estimated_cost, images,
  resolution_photo, resolution_confidence, resolution_notes, citizen_confirmed, created_at, updated_at
) VALUES (
  'CP-1063', 'Construction Debris Dumped in Primary School Bus Bay', 'Crushed drywall and concrete rubble dumped in designated student pickup cutout.', 'Garbage', 'Assigned', 7,
  '4 tons of rubble', ARRAY['Child boarding obstruction', 'Sharp rebar hazard'], false, 'Sanitation & Solid Waste Dept', 'Heavy Tipper Unit 8',
  12.9155, 77.6477, 'Sector 2, Near Freedom International School, HSR', 'Ward 84', 58,
  'Priya Sharma', false, 48, '2026-10-25T09:57:55.477Z', 17100, ARRAY['https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80'],
  NULL, NULL, NULL, false, '2026-10-23T09:57:55.477Z', '2026-10-23T17:33:55.477Z'
) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, upvotes = EXCLUDED.upvotes;

INSERT INTO public.issues (
  id, title, description, category, status, severity, size_estimate, safety_hazards,
  is_emergency, department, assigned_team, lat, lng, address, ward, upvotes,
  reporter_name, is_anonymous, sla_hours, sla_deadline, estimated_cost, images,
  resolution_photo, resolution_confidence, resolution_notes, citizen_confirmed, created_at, updated_at
) VALUES (
  'CP-1064', 'Main Supply Sump Overflowing into Public Street', 'Float valve failure at pumping station causing 50,000 liters of treated drinking water to waste into gutter.', 'Water Leakage', 'In Progress', 8,
  'Overhead tank overflow 80 LPM', ARRAY['Massive potable water wastage'], false, 'Water Supply & Sewerage Board', 'Pumping Station Instrumentation Cell',
  12.9688, 77.7444, 'Channasandra Water Pumping Hub, Whitefield', 'Ward 78', 52,
  'Priya Sharma', false, 48, '2026-10-25T19:57:55.477Z', 19800, ARRAY['https://images.unsplash.com/photo-1584824486509-112e4181ff6b?w=800&auto=format&fit=crop&q=80'],
  NULL, NULL, NULL, false, '2026-10-23T19:57:55.477Z', '2026-10-23T23:33:55.477Z'
) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, upvotes = EXCLUDED.upvotes;

INSERT INTO public.issues (
  id, title, description, category, status, severity, size_estimate, safety_hazards,
  is_emergency, department, assigned_team, lat, lng, address, ward, upvotes,
  reporter_name, is_anonymous, sla_hours, sla_deadline, estimated_cost, images,
  resolution_photo, resolution_confidence, resolution_notes, citizen_confirmed, created_at, updated_at
) VALUES (
  'CP-1065', 'Collapsed Drain Slab Leaving Open 1.8m Abyss Near Bus Stop', 'Pedestrian boarding slab collapsed under heavy foot traffic into open stormwater drain channel.', 'Drainage Overflow', 'In Progress', 9,
  '1.8m depth, 2m length', ARRAY['Imminent serious injury for commuters', 'Transit bottle neck'], true, 'Stormwater & Drainage Dept', 'Rapid Slab Replacement Unit 1',
  12.9388, 77.6766, 'Bellandur Bus Stop, Near Central Mall', 'Ward 56', 134,
  'Civic Vigilante', false, 24, '2026-10-24T21:57:55.477Z', 26550, ARRAY['https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800&auto=format&fit=crop&q=80'],
  NULL, NULL, NULL, false, '2026-10-23T21:57:55.477Z', '2026-10-24T00:45:55.477Z'
) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, upvotes = EXCLUDED.upvotes;

