import { useEffect, useMemo, useState } from 'react'

import {
  BooleanFilter,
  FilterSection,
  SelectFilter,
} from 'app/components/Filters'
import { QueryParams } from 'app/constants/query'
import { useFilter } from 'app/hooks/useFilter'
import { useI18n } from 'app/hooks/useI18n'
import { i18n } from 'app/i18n'
import {
  AvailableFilesFilterOption,
  NumberOfRunsFilterOption,
} from 'app/types/filter'

const NUMBER_OF_RUN_OPTIONS: NumberOfRunsFilterOption[] = [
  { value: '>1' },
  { value: '>5' },
  { value: '>10' },
  { value: '>20' },
  { value: '>100' },
]

const AVAILABLE_FILES_OPTIONS: AvailableFilesFilterOption[] = [
  { value: 'raw-frames', label: i18n.rawFrames },
  { value: 'tilt-series', label: i18n.tiltSeries },
  { value: 'tilt-series-alignment', label: i18n.tiltSeriesAlignment },
  { value: 'tomogram', label: i18n.tomograms },
]

const AVAILABLE_FILES_CLASS_NAME = 'select-available-files'
const MEETS_ALL_LABEL_ID = 'meets-all'

export function IncludedContentsFilterSection() {
  const {
    updateValue,
    includedContents: { isGroundTruthEnabled, availableFiles, numberOfRuns },
  } = useFilter()

  const availableFilesOptions = useMemo(
    () =>
      availableFiles
        .map(
          (option) =>
            AVAILABLE_FILES_OPTIONS.find(({ value }) => value === option) ??
            null,
        )
        .filter((option): option is AvailableFilesFilterOption => !!option),
    [availableFiles],
  )

  const numberOfRunsOptions = useMemo(
    () =>
      numberOfRuns
        ? NUMBER_OF_RUN_OPTIONS.find(({ value }) => value === numberOfRuns) ??
          null
        : null,
    [numberOfRuns],
  )

  const { t } = useI18n()

  const [showMeetsAll, setShowMeetsAll] = useState(availableFiles.length > 0)

  // Really hacky way to get a label to show above the selected chips for the
  // SDS ComplexFilter component. We need to do this because the SDS does not
  // yet provide a way to add a label.
  // TODO Update upstream component to support chip labels
  useEffect(() => {
    const meetsAllNode = document.getElementById(
      MEETS_ALL_LABEL_ID,
    ) as HTMLSpanElement | null

    if (showMeetsAll && !meetsAllNode) {
      const filterButtonNode = document.querySelector(
        `.${AVAILABLE_FILES_CLASS_NAME} > button`,
      )

      const meetsAll = document.createElement('div')
      meetsAll.id = MEETS_ALL_LABEL_ID
      meetsAll.textContent = t('meetsAll')

      filterButtonNode?.insertAdjacentElement('afterend', meetsAll)
    } else if (!showMeetsAll && meetsAllNode) {
      meetsAllNode.remove()
    }
  }, [showMeetsAll, t])

  return (
    <FilterSection title={i18n.includedContents}>
      <BooleanFilter
        label={i18n.groundTruthAnnotation}
        onChange={(value) =>
          updateValue(QueryParams.GroundTruthAnnotation, value ? 'true' : null)
        }
        value={isGroundTruthEnabled}
      />

      <SelectFilter
        multiple
        options={AVAILABLE_FILES_OPTIONS}
        value={availableFilesOptions}
        label={i18n.availableFiles}
        onChange={(options) => {
          setShowMeetsAll((options?.length ?? 0) > 0)
          updateValue(QueryParams.AvailableFiles, options)
        }}
        title={`${t('resultsMustIncludeAllFileTypes')}:`}
        popperClassName="max-w-[244px]"
        className={AVAILABLE_FILES_CLASS_NAME}
      />

      <SelectFilter
        options={NUMBER_OF_RUN_OPTIONS}
        value={numberOfRunsOptions}
        label={i18n.numberOfRuns}
        onChange={(option) =>
          updateValue(
            QueryParams.NumberOfRuns,
            option ? JSON.stringify(option.value) : null,
          )
        }
      />
    </FilterSection>
  )
}
