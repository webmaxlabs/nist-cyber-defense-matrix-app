-- Calculate project overall score (average of all assessed cells)
CREATE OR REPLACE FUNCTION calculate_project_score(p_project_id UUID)
RETURNS NUMERIC AS $$
DECLARE
  avg_score NUMERIC;
BEGIN
  SELECT COALESCE(AVG(maturity_level), 0) INTO avg_score
  FROM cell_assessments
  WHERE project_id = p_project_id;
  RETURN ROUND(avg_score, 2);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Calculate coverage percentage (assessed cells / 25 total)
CREATE OR REPLACE FUNCTION calculate_coverage(p_project_id UUID)
RETURNS NUMERIC AS $$
DECLARE
  assessed_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO assessed_count
  FROM cell_assessments
  WHERE project_id = p_project_id;
  RETURN ROUND((assessed_count::NUMERIC / 25) * 100, 2);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get maturity by NIST function
CREATE OR REPLACE FUNCTION get_nist_maturity(p_project_id UUID)
RETURNS TABLE(nist_func TEXT, avg_maturity NUMERIC) AS $$
BEGIN
  RETURN QUERY
  SELECT cell_column::TEXT, ROUND(AVG(maturity_level), 2)
  FROM cell_assessments
  WHERE project_id = p_project_id
  GROUP BY cell_column;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get maturity by asset class
CREATE OR REPLACE FUNCTION get_asset_maturity(p_project_id UUID)
RETURNS TABLE(asset TEXT, avg_maturity NUMERIC) AS $$
BEGIN
  RETURN QUERY
  SELECT cell_row::TEXT, ROUND(AVG(maturity_level), 2)
  FROM cell_assessments
  WHERE project_id = p_project_id
  GROUP BY cell_row;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-update project scores on assessment changes
CREATE OR REPLACE FUNCTION update_project_scores()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE projects
  SET
    overall_score = calculate_project_score(COALESCE(NEW.project_id, OLD.project_id)),
    coverage_percentage = calculate_coverage(COALESCE(NEW.project_id, OLD.project_id)),
    updated_at = now()
  WHERE id = COALESCE(NEW.project_id, OLD.project_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_assessment_change
  AFTER INSERT OR UPDATE OR DELETE ON cell_assessments
  FOR EACH ROW EXECUTE FUNCTION update_project_scores();
