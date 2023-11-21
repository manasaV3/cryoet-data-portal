import { useSearchParams } from '@remix-run/react'
import { useMemo } from 'react'

import { FilterSection, SelectFilter } from 'app/components/Filters'
import { DatasetFilterQueryParams } from 'app/constants/query'
import { useDatasets } from 'app/hooks/useDatasets'
import { i18n } from 'app/i18n'
import { BaseFilterOption } from 'app/types/filter'

export function AnnotationMetadataFilterSection() {
  const { objectNames, objectShapeTypes } = useDatasets()
  const [searchParams, setSearchParams] = useSearchParams()

  const objectNameOptions = useMemo(
    () => objectNames.map<BaseFilterOption>((value) => ({ value })),
    [objectNames],
  )

  const objectNameValue = useMemo<BaseFilterOption[]>(
    () =>
      searchParams
        .getAll(DatasetFilterQueryParams.ObjectName)
        .map((value) => ({ value })),
    [searchParams],
  )

  const objectShapeTypeOptions = useMemo(
    () => objectShapeTypes.map<BaseFilterOption>((value) => ({ value })),
    [objectShapeTypes],
  )

  const objectShapeTypeValue = useMemo<BaseFilterOption[]>(
    () =>
      searchParams
        .getAll(DatasetFilterQueryParams.ObjectShapeType)
        .map((value) => ({ value })),
    [searchParams],
  )

  return (
    <FilterSection title={i18n.annotationMetadata}>
      <SelectFilter
        multiple
        options={objectNameOptions}
        value={objectNameValue}
        label={i18n.objectName}
        onChange={(options) =>
          setSearchParams((prev) => {
            prev.delete(DatasetFilterQueryParams.ObjectName)

            options?.forEach((option) =>
              prev.append(DatasetFilterQueryParams.ObjectName, option.value),
            )

            return prev
          })
        }
      />

      <SelectFilter
        multiple
        options={objectShapeTypeOptions}
        value={objectShapeTypeValue}
        label={i18n.objectShapeType}
        onChange={(options) =>
          setSearchParams((prev) => {
            prev.delete(DatasetFilterQueryParams.ObjectShapeType)

            options?.forEach((option) =>
              prev.append(
                DatasetFilterQueryParams.ObjectShapeType,
                option.value,
              ),
            )

            return prev
          })
        }
      />
    </FilterSection>
  )
}
