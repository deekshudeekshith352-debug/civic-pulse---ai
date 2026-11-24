/**
 * Praja Voice AI - Database Seeder Script
 * Seeds 60+ rich civic reports across wards into PostgreSQL / Supabase
 */
import { getInitialSeedReports } from '../src/data/seedReports';
import fs from 'fs';
import path from 'path';

async function generateSeedSQL() {
  const reports = getInitialSeedReports();
  console.log(`Generating seed SQL for ${reports.length} realistic reports...`);

  let sql = `-- Praja Voice AI - Seed Data Dump (${reports.length} reports)\n\n`;

  for (const r of reports) {
    const escapedTitle = r.title.replace(/'/g, "''");
    const escapedDesc = r.description.replace(/'/g, "''");
    const escapedAddress = r.address.replace(/'/g, "''");
    const escapedDept = r.department.replace(/'/g, "''");
    const escapedTeam = r.assignedTeam ? `'${r.assignedTeam.replace(/'/g, "''")}'` : 'NULL';
    const hazardsArray = `ARRAY[${r.safetyHazards.map((h) => `'${h.replace(/'/g, "''")}'`).join(', ')}]`;
    const imagesArray = `ARRAY['${r.images[0]}']`;
    const resPhoto = r.resolutionPhoto ? `'${r.resolutionPhoto}'` : 'NULL';
    const resNotes = r.resolutionNotes ? `'${r.resolutionNotes.replace(/'/g, "''")}'` : 'NULL';
    const resConf = r.resolutionConfidence ? r.resolutionConfidence : 'NULL';

    sql += `INSERT INTO public.issues (
  id, title, description, category, status, severity, size_estimate, safety_hazards,
  is_emergency, department, assigned_team, lat, lng, address, ward, upvotes,
  reporter_name, is_anonymous, sla_hours, sla_deadline, estimated_cost, images,
  resolution_photo, resolution_confidence, resolution_notes, citizen_confirmed, created_at, updated_at
) VALUES (
  '${r.id}', '${escapedTitle}', '${escapedDesc}', '${r.category}', '${r.status}', ${r.severity},
  '${r.sizeEstimate}', ${hazardsArray}, ${r.isEmergency}, '${escapedDept}', ${escapedTeam},
  ${r.lat}, ${r.lng}, '${escapedAddress}', '${r.ward}', ${r.upvotes},
  '${r.reporterName}', ${r.isAnonymous}, ${r.slaHours}, '${r.slaDeadline}', ${r.estimatedCostINR || 4500}, ${imagesArray},
  ${resPhoto}, ${resConf}, ${resNotes}, ${r.citizenConfirmed}, '${r.createdAt}', '${r.updatedAt}'
) ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, upvotes = EXCLUDED.upvotes;\n\n`;
  }

  const outPath = path.resolve(process.cwd(), 'supabase/seed.sql');
  fs.writeFileSync(outPath, sql);
  console.log(`Successfully generated SQL seed file: ${outPath}`);
}

generateSeedSQL();
