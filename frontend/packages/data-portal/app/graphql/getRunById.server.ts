import type { ApolloClient, NormalizedCacheObject } from '@apollo/client'

import { gql } from 'app/__generated__'
import { MAX_PER_PAGE } from 'app/constants/pagination'

const GET_RUN_BY_ID_QUERY = gql(`
  query GetRunById($id: Int, $limit: Int, $offset: Int) {
    runs(where: { id: { _eq: $id } }) {
      id
      name

      tiltseries {
        acceleration_voltage
        aligned_tiltseries_binning
        binning_from_frames
        camera_manufacturer
        camera_model
        data_acquisition_software
        id
        is_aligned
        microscope_additional_info
        microscope_energy_filter
        microscope_image_corrector
        microscope_manufacturer
        microscope_model
        microscope_phase_plate
        pixel_spacing
        related_empiar_entry
        spherical_aberration_constant
        tilt_axis
        tilt_max
        tilt_min
        tilt_range
        tilt_series_quality
        tilt_step
        tilting_scheme
        total_flux
      }

      dataset {
        cell_component_name
        cell_component_id
        cell_name
        cell_strain_name
        cell_strain_id
        cell_type_id
        dataset_citations
        dataset_publications
        deposition_date
        description
        grid_preparation
        id
        last_modified_date
        organism_name
        organism_taxid
        other_setup
        related_database_entries
        related_database_entries
        release_date
        s3_prefix
        sample_preparation
        sample_type
        tissue_name
        tissue_id
        title

        authors(
          order_by: {
            author_list_order: asc,
          },
        ) {
          name
          email
          primary_author_status
          corresponding_author_status
        }

        authors_with_affiliation: authors(where: { affiliation_name: { _is_null: false } }) {
          name
          affiliation_name
        }

        funding_sources {
          funding_agency_name
          grant_id
        }
      }

      tomogram_voxel_spacings(limit: 1) {
        id
        s3_prefix

        tomograms(
          limit: 1,
          where: {
            is_canonical: { _eq: true }
          },
        ) {
          affine_transformation_matrix
          ctf_corrected
          fiducial_alignment_status
          id
          key_photo_url
          name
          neuroglancer_config
          processing
          processing_software
          reconstruction_method
          reconstruction_software
          size_x
          size_y
          size_z
          voxel_spacing
        }
      }

      annotation_table: tomogram_voxel_spacings {
        annotations(limit: $limit, offset: $offset) {
          annotation_method
          annotation_publication
          annotation_software
          confidence_precision
          confidence_recall
          deposition_date
          ground_truth_status
          ground_truth_used
          is_curator_recommended
          last_modified_date
          object_count
          object_description
          object_id
          object_name
          object_state
          release_date

          files {
            https_path
            s3_path
            shape_type
          }

          authors(order_by: { primary_annotator_status: desc }) {
            name
            primary_annotator_status
          }

          author_affiliations: authors(distinct_on: affiliation_name) {
            affiliation_name
          }

          authors_aggregate {
            aggregate {
              count
            }
          }
        }
      }

      tomogram_stats: tomogram_voxel_spacings {
        annotations(distinct_on: object_name) {
          object_name
        }

        annotations_aggregate {
          aggregate {
            count
          }
        }

        tomogram_processing: tomograms(distinct_on: processing) {
          processing
        }

        tomogram_resolutions: tomograms(distinct_on: voxel_spacing) {
          https_mrc_scale0
          id
          processing
          s3_mrc_scale0
          size_x
          size_y
          size_z
          voxel_spacing
        }

        tomograms_aggregate {
          aggregate {
            count
          }
        }
      }

      tiltseries_aggregate {
        aggregate {
          count
          avg {
            tilt_series_quality
          }
        }
      }
    }
  }
`)

export async function getRunById({
  client,
  id,
  page = 1,
}: {
  client: ApolloClient<NormalizedCacheObject>
  id: number
  page?: number
}) {
  return client.query({
    query: GET_RUN_BY_ID_QUERY,
    variables: {
      id,
      limit: MAX_PER_PAGE,
      offset: (page - 1) * MAX_PER_PAGE,
    },
  })
}
