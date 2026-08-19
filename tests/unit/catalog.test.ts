import { describe, expect, it } from 'vitest';
import { databaseProfiles } from '../../docs/.vitepress/theme/data/databaseProfiles';
import { databaseGuides } from '../../docs/.vitepress/theme/data/databaseGuides';
import { connectionStringProfiles } from '../../docs/.vitepress/theme/data/connectionStrings';
import { defaultSources, engineCatalog, engineOrder } from '../../docs/.vitepress/theme/data/engineCatalog';
import { databaseBrands, databaseLogoPath, databaseProductBrandIds } from '../../docs/.vitepress/theme/data/databaseBranding';
import { analyticalDatabaseItems, noSqlDatabaseItems, sqlDatabaseItems } from '../../docs/.vitepress/theme/data/databaseNavigation';
import fs from 'node:fs';
import path from 'node:path';

describe('database catalog', () => {
  it('registers all five browser engines', () => {
    expect(engineOrder).toEqual(['sqlite', 'duckdb', 'pglite', 'surrealdb', 'indexeddb']);
    for (const id of engineOrder) {
      expect(engineCatalog[id].description.length).toBeGreaterThan(12);
      expect(defaultSources[id].length).toBeGreaterThan(30);
      expect(databaseBrands[engineCatalog[id].brandId]).toBeDefined();
    }
  });

  it('keeps navigation, profiles and local brand assets in sync', () => {
    const navigationIds = [...sqlDatabaseItems, ...analyticalDatabaseItems, ...noSqlDatabaseItems].map((item) => item.id).sort();
    expect(navigationIds).toEqual(Object.keys(databaseProfiles).sort());
    expect([...databaseProductBrandIds].sort()).toEqual(Object.keys(databaseProfiles).sort());
    for (const id of Object.keys(databaseBrands) as Array<keyof typeof databaseBrands>) {
      const asset = databaseLogoPath(id).replace(/^\//, 'docs/public/');
      expect(fs.existsSync(path.resolve(process.cwd(), asset)), `${id} should have a local SVG`).toBe(true);
    }
  });

  it('keeps product profiles decision-complete', () => {
    expect(Object.keys(databaseProfiles).length).toBeGreaterThanOrEqual(24);
    for (const profile of Object.values(databaseProfiles)) {
      expect(profile.transactions).toHaveLength(3);
      expect(profile.indexes).toHaveLength(3);
      expect(profile.scaling).toHaveLength(3);
      expect(profile.deployment).toHaveLength(3);
      expect(profile.useCases).toHaveLength(3);
      expect(profile.limitations).toHaveLength(3);
      expect(profile.recommendation.length).toBeGreaterThan(20);
    }
  });

  it('does not claim unsupported server databases are live', () => {
    const live = Object.values(databaseProfiles).filter((profile) => profile.liveEngine).map((profile) => profile.id);
    expect(live.sort()).toEqual(['duckdb', 'postgresql', 'sqlite']);
  });

  it('provides core concepts and version guidance for every database', () => {
    expect(Object.keys(databaseGuides).sort()).toEqual(Object.keys(databaseProfiles).sort());
    for (const guide of Object.values(databaseGuides)) {
      expect(guide.goals).toHaveLength(3);
      expect(guide.concepts).toHaveLength(3);
      expect(guide.versions).toHaveLength(3);
      expect(guide.upgradeFocus).toHaveLength(3);
      expect(guide.officialReleaseNotes).toMatch(/^https:\/\//);
      for (const concept of guide.concepts) expect(concept.points).toHaveLength(3);
    }
  });

  it('compares connection details for every database', () => {
    expect(connectionStringProfiles.map((profile) => profile.id).sort()).toEqual(Object.keys(databaseProfiles).sort());
    for (const profile of connectionStringProfiles) {
      expect(profile.example.length).toBeGreaterThan(8);
      expect(profile.tls.length).toBeGreaterThan(2);
      expect(profile.namespace.length).toBeGreaterThan(3);
      expect(profile.note.length).toBeGreaterThan(12);
      expect(profile.docs).toMatch(/^https:\/\//);
    }
  });
});
